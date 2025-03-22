use std::{
    collections::{HashMap, HashSet},
    fs,
    path::Path,
};

use deno_ast::swc::ast::TsKeywordTypeKind;

use crate::utils::file_utils::{
    get_file_name, get_relative_path, write_file,
};

use super::datas::{AssetBundleData, ExportData, VarType};

pub fn export_to_ts(output: &str, packages: &Vec<String>, datas: &Vec<AssetBundleData>) {
    for data in datas {
        build(output, packages, data);
    }
}

fn build(output: &str, packages: &Vec<String>, data: &AssetBundleData) {
    for export in &data.exports {
        build_export(output, packages, data, export);
    }
}

fn build_export(
    output: &str,
    packages: &Vec<String>,
    asset_bundle: &AssetBundleData,
    data: &ExportData,
) {
    let mut used_type = HashSet::new();
    for (_, value) in &data.propertys {
        check_used_types(&mut used_type, value);
    }
    for (_, value) in &data.handlers {
        check_used_types(&mut used_type, value);
    }

    let mut new_imports = HashMap::new();
    let mut imports = HashMap::new();
    for (key, value) in &data.sources {
        for var_type in &used_type {
            if value.contains(&var_type) {
                imports.insert(var_type.to_string(), key.to_string());
                if !new_imports.contains_key(key) {
                    new_imports.insert(key.to_string(), Vec::new());
                }
                let list = new_imports.get_mut(key).unwrap();
                list.push(var_type);
            }
        }
    }
    let output_path = Path::new(output);
    let output_file_name = get_file_name(output_path);
    let ab_path = Path::new(&asset_bundle.path);
    let ab_name = get_file_name(ab_path);
    //检测是否有非法引用
    for var_type in &used_type {
        //ts内部类型
        if is_ts_keyword_type(var_type) {
            continue;
        }
        if !imports.contains_key(var_type) {
            println!(
                "模块:{}中的{}为包内定义,无法作为{}的对外属性或函数参数！！！",
                ab_name, var_type, &data.name
            );
        }
    }
    if data.is_empty() {
        println!("{}{}", data.name, "没有需要导出的属性和方法，无需导出");
        return;
    }
    let mut imports_code = String::new();
    if !new_imports.is_empty() {
        for (src, list) in new_imports {
            //是否属于公共包
            let in_package = packages.iter().any(|x| src.contains(x));
            dbg!(in_package);
            //非本地，非其他模块，或 在导出目录下
            if in_package || !src.starts_with(".") || src.contains(&output_file_name) {
                let mut class = Vec::new();
                for imp in list {
                    class.push(imp.to_string());
                }
                let code = format!("import {{{}}} from \"{}\";\n", class.join(","), src);
                imports_code.push_str(&code);
                continue;
            }
            //模块内部的导入，将多个拆分
            if src.starts_with("./") && list.len() > 1 {
                for imp in list {
                    let path = Path::new(&src);
                    let file_name = path.file_name().unwrap().to_str().unwrap().to_string();
                    let class_name = format!("ExI_{}", imp);
                    let new_src = src.replace(&file_name, &class_name);
                    let code = format!("import {{{}}} from \"{}\";\n", class_name, new_src);
                    imports_code.push_str(&code);
                }
                continue;
            }
            let new_src = get_new_src(&src, &asset_bundle.path, &data.path);
            let mut class = Vec::new();
            for imp in list {
                class.push(format!("ExI_{}", imp));
            }
            let code = format!("import {{{}}} from \"{}\";\n", class.join(","), new_src);
            imports_code.push_str(&code);
        }
    }

    let mut interface_code = String::from(format!("export interface ExI_{} {{\n", data.name));
    //属性
    if !data.propertys.is_empty() {
        for item in &data.propertys {
            let property_code = format!(
                "    {}",
                get_property_code(item.0, item.1, &imports, &output_file_name)
            );
            interface_code.push_str(&property_code);
            interface_code.push_str("\n");
        }
    }

    if !data.handlers.is_empty() {
        for item in &data.handlers {
            let func_code = format!(
                "    {}",
                get_func_code(item.0, item.1, &imports, &output_file_name)
            );
            interface_code.push_str(&func_code);
            interface_code.push_str("\n");
        }
    }
    interface_code.push_str("}");

    let code = format!("{}\n{}", &imports_code, &interface_code);
    //获取文件相对路径
    let file_parent = Path::new(&data.path).parent().unwrap();
    let r_path = get_relative_path(&ab_path, &file_parent);
    let dir = if r_path.is_empty() {
        format!("{}\\{}", output, ab_name)
    } else {
        format!("{}\\{}\\{}", output, ab_name, r_path)
    };
    if !fs::exists(&dir).unwrap() {
        fs::create_dir_all(&dir).expect("创建文件夹失败!");
    }
    let file_path = format!("{}\\{}.ts", &dir, format!("ExI_{}", data.name));
    write_file(&file_path, &code);
}

fn check_used_types(used_type: &mut HashSet<String>, var_type: &VarType) {
    match var_type {
        VarType::String(t) => {
            used_type.insert(t.to_string());
        }
        VarType::List(vec) => {
            for item in vec {
                check_used_types(used_type, item);
            }
        }
        VarType::Func(vec, var_type) => {
            for item in vec {
                check_used_types(used_type, &item.var_type);
            }
            check_used_types(used_type, var_type);
        }
        _ => {}
    }
}

fn get_new_src(src: &str, asset_bundle: &str, path: &str) -> String {
    if !src.contains("/") {
        return src.to_string();
    }
    //模块内部的交叉引用
    if src.contains("./") {
        let name = Path::new(src)
            .file_name()
            .unwrap_or_default()
            .to_string_lossy()
            .into_owned();
        return src.replace(&name, &format!("ExI_{}", &name));
    }
    let ab_path = Path::new(asset_bundle);
    let script_dir = Path::new(path).parent().unwrap();

    //相对assetBundle目录的路径
    let local_dir = script_dir
        .strip_prefix(&ab_path)
        .unwrap()
        .to_str()
        .unwrap()
        .to_string();

    if local_dir.is_empty() {
        return src.to_string();
    }
    dbg!("相对目录:{}", local_dir);
    dbg!(src, asset_bundle, path);
    "".to_string()
}

fn get_property_code(
    name: &str,
    var_type: &VarType,
    imports: &HashMap<String, String>,
    output_file_name: &str,
) -> String {
    format!(
        "{}:{};",
        name,
        get_property_type(var_type, imports, output_file_name)
    )
}

fn get_func_code(
    name: &str,
    var_type: &VarType,
    imports: &HashMap<String, String>,
    output_file_name: &str,
) -> String {
    format!(
        "{}{}",
        name,
        get_func_type(var_type, imports, output_file_name)
    )
}

fn get_func_type(
    var_type: &VarType,
    imports: &HashMap<String, String>,
    output_file_name: &str,
) -> String {
    if let VarType::Func(list, return_type) = var_type {
        let mut code = String::from("(");
        let mut func_props = Vec::new();
        for var_data in list {
            let v = format!(
                "{}:{}",
                var_data.name,
                get_property_type(&var_data.var_type, imports, output_file_name)
            );
            func_props.push(v);
        }
        code.push_str(&func_props.join(","));
        code.push_str("):");
        let var_type = &**return_type;
        let var_type_str = get_property_type(var_type, imports, output_file_name);
        code.push_str(&var_type_str);
        return code;
    } else {
        panic!("函数类型错误!")
    }
}

fn get_property_type(
    var_type: &VarType,
    imports: &HashMap<String, String>,
    output_file_name: &str,
) -> String {
    match var_type {
        VarType::String(type_name) => {
            let name = type_name.clone();
            //ts内部类型
            if is_ts_keyword_type(&name) {
                return name;
            }
            if imports.contains_key(&name) {
                let src = imports.get(&name).unwrap();
                //底层库类型
                if src.starts_with("htsd-cc") || src.contains(output_file_name) {
                    return name;
                }
            }
            return format!("ExI_{}", &name);
        }
        //ts内置类型，如string,number,bool等
        VarType::Type(keyword_type) => {
            let name = get_keyword_type(keyword_type);
            return name;
        }
        VarType::List(list) => {
            let mut types = Vec::new();
            for var_type in list {
                types.push(get_property_type(var_type, imports, output_file_name));
            }
            return types.join("|");
        }
        VarType::Func(list, return_type) => {
            let mut code = String::from("((");
            let mut func_props = Vec::new();
            for var_data in list {
                let v = format!(
                    "{}:{}",
                    var_data.name,
                    get_property_type(&var_data.var_type, imports, output_file_name)
                );
                func_props.push(v);
            }
            code.push_str(&func_props.join(","));
            code.push_str(")=>");
            let var_type = &**return_type;
            let var_type_str = get_property_type(var_type, imports, output_file_name);
            code.push_str(&var_type_str);
            code.push_str(")");
            return code;
        }
    }
}

fn get_keyword_type(ts_type: &TsKeywordTypeKind) -> String {
    match ts_type {
        TsKeywordTypeKind::TsAnyKeyword => {
            return "any".to_string();
        }
        TsKeywordTypeKind::TsUnknownKeyword => {
            return "unknown".to_string();
        }
        TsKeywordTypeKind::TsNumberKeyword => {
            return "number".to_string();
        }
        TsKeywordTypeKind::TsObjectKeyword => {
            return "Object".to_string();
        }
        TsKeywordTypeKind::TsBooleanKeyword => {
            return "boolean".to_string();
        }
        TsKeywordTypeKind::TsBigIntKeyword => {
            return "BigInt".to_string();
        }
        TsKeywordTypeKind::TsStringKeyword => {
            return "string".to_string();
        }
        TsKeywordTypeKind::TsSymbolKeyword => {
            return "symbol".to_string();
        }
        TsKeywordTypeKind::TsVoidKeyword => {
            return "void".to_string();
        }
        TsKeywordTypeKind::TsUndefinedKeyword => {
            return "undefined".to_string();
        }
        TsKeywordTypeKind::TsNullKeyword => return "null".to_string(),
        TsKeywordTypeKind::TsNeverKeyword => {
            return "never".to_string();
        }
        TsKeywordTypeKind::TsIntrinsicKeyword => {
            return "intrinsic".to_string();
        }
    }
}

///是否是ts内置类型
fn is_ts_keyword_type(var_type: &str) -> bool {
    match var_type {
        "any" | "unknown" | "number" | "Object" | "boolean" | "BigInt" | "string" | "symbol"
        | "void" | "undefined" | "never" | "intrinsic" | "null" | "Error" => {
            return true;
        }
        _ => {
            return false;
        }
    }
}
