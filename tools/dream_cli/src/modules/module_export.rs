use clap::Args;
use core::panic;
use deno_ast::{
    parse_module,
    swc::{
        ast::{
            Accessibility, ClassDecl, ClassMember, Decl, Expr, Lit, MethodKind, Module, ModuleDecl,
            ModuleItem, Param, Pat, Stmt, TsEntityName, TsEnumDecl, TsFnOrConstructorType,
            TsFnParam, TsInterfaceDecl, TsKeywordTypeKind, TsQualifiedName, TsType, TsTypeElement,
        },
        common::{Span, Spanned},
    },
    MediaType, ParseParams, SourceRangedForSpanned,
};
use serde_json::Value;
use std::{
    collections::{HashMap, HashSet},
    error::Error,
    fs::{self, File},
    io::Read,
    path::{Path, PathBuf},
};

use crate::utils::file_utils::{capitalize_first_letter, clear_directory, write_file};

use super::{
    datas::{
        AssetBundleData, EnumData, ExportData, ExportDeclData, ExportDefine, VarData, VarType,
    },
    export2ts::Export2Ts,
};

#[derive(Args, Debug, Clone)]
pub struct ModuleExportArgs {
    #[arg(short, long, help = "输入")]
    input: Option<String>,
    #[arg(short, long, help = "输出")]
    output: Option<String>,
    #[arg(short, long, help = "模块枚举定义文件路径")]
    module_define: Option<String>,
    #[arg(short, long, help = "公共包名称",default_values(["games"]))]
    packages: Option<Vec<String>>,
    #[arg(short, long, help = "命名空间", default_value = "EXI")]
    namespace: Option<String>,
    #[arg(short, long, help = "排除包含内容的文件", default_values = ["UI_","Binder","Mediator"])]
    f_excludes: Option<Vec<String>>,
    #[arg(short, long, help = "是否输出日志", default_value = "false")]
    debug: Option<bool>,
}

///模块导出
pub async fn module_export(args: ModuleExportArgs) -> Result<(), Box<dyn Error>> {
    if args.input.is_none() {
        panic!("请输入input参数");
    }
    if args.output.is_none() {
        panic!("请输入output参数");
    }
    if args.module_define.is_none() {
        panic!("请输入module_define参数");
    }
    let input = args.input.unwrap();
    let output = args.output.unwrap();
    let excludes = args.f_excludes.unwrap();
    let debug = args.debug.unwrap();
    let module_define = args.module_define.unwrap();
    if input == output {
        panic!("input参数和output参数不能相同");
    }
    //清理老的
    if fs::exists(&output).is_err() {
        fs::create_dir_all(&output)?;
    } else {
        clear_directory(&output, "ts")?
    }
    let namespace = args.namespace.unwrap();
    let packages = args.packages.unwrap();
    //获取所有模块文件夹
    let asset_bundles = get_all_module(&input)?;

    let mut export_list = Vec::new();
    //模块名称数组
    let mut module_keys: Vec<String> = Vec::new();

    for asset_bundle in asset_bundles {
        let asset_bundle_path = Path::new(&asset_bundle);
        //包名称
        let asset_bundle_name: String = asset_bundle_path
            .file_name()
            .unwrap()
            .to_str()
            .unwrap()
            .to_string();

        module_keys.push(asset_bundle_name.clone());
        //模块导出数据
        let mut ab_data = AssetBundleData::new(&asset_bundle_name, &asset_bundle);

        let defines = get_module_data_files(&asset_bundle_path, &excludes, debug);
        for define in &defines {
            if define.decl.is_none() {
                continue;
            }
            let export_data = get_export_data(define);
            if export_data.is_empty() {
                println!("{} 未找到需要导出的数据，跳过!", &export_data.path);
                continue;
            }
            ab_data.exports.push(export_data);
        }
        export_list.push(ab_data);
    }
    //导出接口
    let export_config = Export2Ts::new(&input, &output, packages, &namespace, debug);
    export(&export_config, &mut export_list);
    //导出模块枚举文件
    let module_enum_file_name = Path::new(&module_define)
        .file_name()
        .unwrap()
        .to_str()
        .unwrap()
        .to_string()
        .replace(".ts", "");
    let mut module_define_code = format!("export enum {} {{\n", module_enum_file_name);
    for module_name in module_keys {
        let enum_key = capitalize_first_letter(&module_name);
        let code = format!("    {} = '{}',\n", &enum_key, &module_name);
        module_define_code.push_str(&code);
    }
    module_define_code += "}\n";
    write_file(&module_define, &module_define_code);
    Ok(())
}

fn export(export_config: &Export2Ts, export_list: &mut Vec<AssetBundleData>) {
    for ab_data in export_list {
        if export_config.debug {
            println!("Export {}", &ab_data.name);
        }
        ab_data.export(export_config);
    }
}
// fn save_to_local(output: &str, export: &ExportDeclData) {
//     let json_str = match export {
//         ExportDeclData::Class(class) => serde_json::to_string(class).unwrap(),
//         ExportDeclData::Interface(inter) => serde_json::to_string(inter).unwrap(),
//     };
//     let path = format!("{}/Test.json", output);
//     write_file(&path, &json_str);
// }

fn get_script(script: &str, span: Span) -> Vec<String> {
    let src = String::from(script);
    let star = span.start().as_byte_pos().0 as usize - 1;
    let end = (span.end().as_byte_pos().0 as usize).min(src.len());
    let new_script = script[star..end].to_string();
    new_script.split("\n").map(|x| x.to_string()).collect()
}

fn get_script_by_num(script: &Vec<String>, star_line: usize, end_line: usize) -> String {
    let mut result = String::new();
    for i in star_line..end_line {
        result.push_str(script.get(i).unwrap());
    }
    result
}

///获取注释
fn get_comment(script: &Vec<String>, prop_name: &str, _class_name: &str) -> String {
    let result = String::new();
    //行索引
    let idx_op = script.iter().position(|x| {
        if x.contains(":") {
            let temp: Vec<&str> = x.split(":").collect();
            if temp[0].contains(prop_name) {
                return true;
            }
        }
        return false;
    });
    if idx_op.is_some() {
        let mut idx = idx_op.unwrap();
        let end = idx;
        //上一行如果是*/,说明是多行注释
        if idx > 0 {
            idx -= 1;
            if script[idx].trim().starts_with("/*") {
                //单行注释
                return script[idx].clone();
            } else if script[idx].trim().starts_with("*/") {
                //往上找
                idx -= 1;
                while idx > 0 {
                    if script[idx].trim().starts_with("/*") {
                        let star = idx;
                        return get_script_by_num(&script, star, end);
                    } else {
                        idx -= 1;
                    }
                }
                panic!("注释错误{}", prop_name)
            } else if script[idx].trim().starts_with("//") {
                //单行注释
                return script[idx].clone();
            }
        }
    } else {
        // println!("类：{},的属性:{},未在代码中找到!", class_name, prop_name);
        return result;
    }
    // println!("类：{},的属性:{},没有检测到注释", class_name, prop_name);
    result
}

fn get_export_data(data: &ExportDefine) -> ExportData {
    let decl = &data.decl.as_ref().unwrap();
    match decl {
        ExportDeclData::Class(class) => {
            return get_class_export(data, class);
        }
        ExportDeclData::Interface(interface) => {
            return get_export_interface(data, interface);
        }
        ExportDeclData::Enum(ts_enum) => {
            return get_export_enum(data, ts_enum);
        }
    }
}

fn get_export_enum(define: &ExportDefine, ts_enum: &TsEnumDecl) -> ExportData {
    let name = &ts_enum.id.sym.to_string();
    let mut result = ExportData::new(name, &define.path);
    let members = &ts_enum.members;
    for member in members {
        let key = member.id.to_owned().ident().unwrap().sym.to_string();
        let value_op = member.init.to_owned();
        if value_op.is_some() {
            let value = &*value_op.unwrap();
            match value {
                Expr::Lit(lit) => match lit {
                    Lit::Str(str) => {
                        let enum_data =
                            EnumData::new(&key, Some(format!("\"{}\"", str.value.to_string())));
                        result.enums.push(enum_data);
                    }
                    Lit::Num(num) => {
                        let enum_data = EnumData::new(&key, Some(num.value.to_string()));
                        result.enums.push(enum_data);
                    }
                    _ => {
                        panic!("枚举暂时只支持字符串和数字!");
                    }
                },
                _ => {}
            }
        } else {
            let enum_data = EnumData::new(&key, None);
            result.enums.push(enum_data);
        }
    }
    result
}

fn get_export_interface(define: &ExportDefine, ts_inter: &TsInterfaceDecl) -> ExportData {
    let name = &ts_inter.id.sym.to_string();
    let body = &ts_inter.body.body;
    let mut result = ExportData::new(name, &define.path);
    result.sources = define.imports.clone();

    //继承的接口
    if ts_inter.extends.len() > 0 {
        let mut interfaces = Vec::new();
        for inter in &ts_inter.extends {
            let expr = &*inter.expr;
            match expr {
                Expr::Ident(ident) => {
                    interfaces.push(VarType::String(ident.sym.to_string()));
                }
                _ => {}
            }
        }
        result.implements = Some(interfaces);
    }

    for item in body {
        match item {
            TsTypeElement::TsPropertySignature(prop) => {
                let prop_name = prop.key.to_owned().ident().unwrap().sym.to_string();
                let type_ann = &*prop.type_ann.to_owned().unwrap();
                let ts_type = &*type_ann.type_ann;
                let var_type = get_type(ts_type);
                result.propertys.insert(prop_name, var_type);
            }
            TsTypeElement::TsMethodSignature(method) => {
                let method_name = method.key.to_owned().ident().unwrap().sym.to_string();
                let mut params = Vec::new();
                for param in &method.params {
                    let data = get_ts_fn_param(param);
                    if data.is_some() {
                        params.push(data.unwrap());
                    }
                }
                let return_type_op = method.type_ann.to_owned();
                if return_type_op.is_none() {
                    result
                        .handlers
                        .insert(method_name, VarType::Func(params, None, MethodKind::Method));
                } else {
                    let func_return_type = &*return_type_op.unwrap();
                    let return_type = get_type(&func_return_type.type_ann);
                    result.handlers.insert(
                        method_name,
                        VarType::Func(params, Some(Box::new(return_type)), MethodKind::Method),
                    );
                }
            }
            TsTypeElement::TsSetterSignature(setter) => {
                let method_name = setter.key.to_owned().ident().unwrap().sym.to_string();
                let data = get_ts_fn_param(&setter.param).unwrap();
                result.handlers.insert(
                    method_name,
                    VarType::Func(vec![data], None, MethodKind::Setter),
                );
            }
            TsTypeElement::TsGetterSignature(getter) => {
                let method_name = getter.key.to_owned().ident().unwrap().sym.to_string();
                let func_return_type = &*getter.type_ann.to_owned().unwrap();
                let return_type = get_type(&func_return_type.type_ann);
                result.handlers.insert(
                    method_name,
                    VarType::Func(vec![], Some(Box::new(return_type)), MethodKind::Getter),
                );
            }
            _ => {
                println!("发现接口未处理内容");
                dbg!(item);
            }
        }
    }
    build_export(define, &mut result);
    result
}

fn get_class_export(define: &ExportDefine, class_decl: &ClassDecl) -> ExportData {
    let class = &*class_decl.class;
    let mut result = ExportData::new(&define.name, &define.path);
    result.sources = define.imports.clone();

    //是否有父类
    if class.super_class.is_some() {
        let super_class = &*class.super_class.to_owned().unwrap();
        match super_class {
            Expr::Ident(ident) => {
                result.super_class = Some(VarType::String(ident.sym.to_string()));
            }
            _ => {}
        }
    } else {
        result.super_class = None;
    }
    //有实现接口
    if !class.implements.is_empty() {
        let mut interfaces = Vec::new();
        for implement in &class.implements {
            let expr = &*implement.expr.to_owned();
            match expr {
                Expr::Ident(ident) => {
                    let interface_name = ident.sym.to_string();
                    interfaces.push(VarType::String(interface_name));
                }
                _ => {}
            }
        }
        result.implements = Some(interfaces);
    } else {
        result.implements = None;
    }

    for class_member in &class.body {
        match class_member {
            ClassMember::ClassProp(class_prop) => {
                //静态属性不导出
                if class_prop.is_static {
                    continue;
                }
                //访问权限
                let accessibility = class_prop.accessibility.unwrap_or(Accessibility::Public);
                if class_prop.accessibility.is_none() || Accessibility::Public == accessibility {
                    let ident_name = &class_prop.key.to_owned().ident().unwrap();
                    let type_ann = &*class_prop.type_ann.to_owned().unwrap();
                    //属性名称
                    let prop_name = ident_name.sym.to_string();
                    // dbg!(&prop_name,&type_ann);
                    let prop_type = get_type(&type_ann.type_ann);
                    result.propertys.insert(prop_name.clone(), prop_type);
                }
            }
            ClassMember::Method(method) => {
                //静态方法不导出
                if method.is_static {
                    continue;
                }
                //访问权限
                let accessibility = method.accessibility.unwrap_or(Accessibility::Public);
                let is_public =
                    method.accessibility.is_none() || Accessibility::Public == accessibility;
                //非公开方法不导出
                if !is_public {
                    continue;
                }
                let func_name = method.key.to_owned().ident().unwrap().sym.to_string();
                let function = &*method.function;
                let params = get_params(&function.params);
                // dbg!(&params);
                let func_return_type_op = method.function.return_type.to_owned();
                if func_return_type_op.is_none() {
                    result
                        .handlers
                        .insert(func_name, VarType::Func(params, None, method.kind));
                } else {
                    let func_return_type = &*func_return_type_op.unwrap();
                    let return_type = get_type(&func_return_type.type_ann);
                    result.handlers.insert(
                        func_name,
                        VarType::Func(params, Some(Box::new(return_type)), method.kind),
                    );
                }
            }
            ClassMember::StaticBlock(_static_block) => {
                panic!("静态内容未处理{}", define.path);
            }
            // ClassMember::Constructor(con) => {}
            // ClassMember::PrivateMethod(method) => {}
            _ => {
                // dbg!(&class_member);
            }
        }
    }
    build_export(define, &mut result);
    result
}

fn build_export(define: &ExportDefine, result: &mut ExportData) {
    // dbg!(&result.propertys);
    //父类
    if result.super_class.is_some() {
        let var_type = result.super_class.as_ref().unwrap();
        check_used_types(&mut result.used_types, var_type);
    }
    //实现的接口
    if result.implements.is_some() {
        let interfaces = result.implements.as_ref().unwrap();
        for var_type in interfaces {
            check_used_types(&mut result.used_types, var_type);
        }
    }
    for (key, value) in &mut result.propertys {
        check_used_types(&mut result.used_types, value);
        let comment = get_comment(&define.script, key, &define.name);
        if !comment.is_empty() {
            result.comments.insert(key.clone(), comment);
        }
    }
    // dbg!(&result.handlers);
    for (key, value) in &mut result.handlers {
        check_used_types(&mut result.used_types, value);
        let comment = get_comment(&define.script, key, &define.name);
        if !comment.is_empty() {
            result.comments.insert(key.clone(), comment);
        }
    }
    // if result.name == "Module_bag" {
    //     dbg!(&result.path, &result.sources);
    // }
    for (key, values) in &result.sources {
        for var_type in &result.used_types {
            if values.contains(&var_type) {
                result
                    .imports
                    .imports
                    .insert(var_type.to_string(), key.to_string());
                if !result.imports.new_imports.contains_key(key) {
                    result
                        .imports
                        .new_imports
                        .insert(key.to_string(), Vec::new());
                }
                let list = result.imports.new_imports.get_mut(key).unwrap();
                list.push(var_type.clone());
            }
        }
    }
    // if result.name == "Module_bag" {
    //     dbg!(&result.path,&result.used_types, &result.imports);
    // }
}

fn check_used_types(used_types: &mut HashSet<String>, var_type: &VarType) {
    match var_type {
        VarType::String(t) => {
            used_types.insert(t.to_string());
        }
        VarType::QualifiedName(class, _) => {
            used_types.insert(class.to_string());
        }
        VarType::List(vec) => {
            for item in vec {
                check_used_types(used_types, item);
            }
        }
        VarType::Func(vec, var_type, _) => {
            for item in vec {
                check_used_types(used_types, &item.var_type);
            }
            if var_type.is_some() {
                check_used_types(used_types, var_type.as_ref().unwrap());
            }
        }
        VarType::T(var_type, types) => {
            used_types.insert(var_type.to_string());
            for item in types {
                check_used_types(used_types, item);
            }
        }
        VarType::Type(_) => {}
    }
}

fn get_params(list: &Vec<Param>) -> Vec<VarData> {
    let mut result = Vec::new();
    for param in list {
        result.push(get_param(&param));
    }
    result
}

fn get_param(param: &Param) -> VarData {
    let mut result = VarData::new();
    let pat = &param.pat.to_owned();
    match pat {
        Pat::Ident(ident) => {
            let type_ann = &*ident.type_ann.to_owned().unwrap();
            //参数名称
            result.name = ident.id.as_ref().to_string();
            result.optional = ident.id.optional;
            result.var_type = get_type(&type_ann.type_ann);
        }
        Pat::Assign(assign) => {
            let left = &*assign.left;
            let ident = left.to_owned().ident().to_owned().unwrap();
            let type_ann = &*ident.type_ann.unwrap();
            result.name = ident.id.sym.to_string();
            result.optional = ident.id.optional;
            result.var_type = get_type(&type_ann.type_ann);
        }
        Pat::Rest(reset_pat) => {
            let arg = &*reset_pat.arg;
            let ident = arg.to_owned().ident().unwrap();
            result.name = ident.id.sym.to_string();
            result.is_reset = true;
            if ident.type_ann.is_none() {
                result.var_type = VarType::Type(TsKeywordTypeKind::TsAnyKeyword);
            } else {
                let type_ann = &*ident.type_ann.unwrap();
                result.var_type = get_type(&type_ann.type_ann);
            }
        }
        _ => {
            dbg!("未处理参数:", pat);
            panic!("未处理参数")
        }
    }
    result
}

fn get_type(ts_type: &TsType) -> VarType {
    match ts_type {
        TsType::TsTypeRef(ts_type_ref) => {
            let type_name = &ts_type_ref.type_name;
            match type_name {
                TsEntityName::Ident(ident) => {
                    let name = &ident.sym.to_string();
                    //简单类型
                    if ts_type_ref.type_params.is_none() {
                        return VarType::String(name.clone());
                    } else {
                        let map_params = &ts_type_ref.type_params.to_owned().unwrap();
                        let params = &map_params.params;
                        let mut types = Vec::new();
                        for param in params {
                            let var_type = get_type(param);
                            types.push(var_type);
                        }
                        return VarType::T(name.to_string(), types);
                    }
                }
                TsEntityName::TsQualifiedName(ts_qualified) => {
                    let name = get_ts_qualified_name(ts_qualified);
                    let idx = name.find(".").unwrap();
                    return VarType::QualifiedName(name[0..idx].to_string(), name);
                }
            }
        }
        TsType::TsKeywordType(key_word_type) => {
            return VarType::Type(key_word_type.kind);
        }
        TsType::TsFnOrConstructorType(fn_or_con) => {
            match fn_or_con {
                TsFnOrConstructorType::TsFnType(ts_fn) => {
                    let mut list = Vec::new();
                    //函数参数
                    for param in &ts_fn.params {
                        let ident = &param.to_owned().ident().unwrap();
                        let prop_name = ident.id.sym.to_string();
                        let ts_type_ann = &*ident.type_ann.to_owned().unwrap();
                        let prop_type = get_type(&ts_type_ann.type_ann);

                        let mut var_data = VarData::new();
                        var_data.name = prop_name;
                        var_data.var_type = prop_type;
                        list.push(var_data);
                    }
                    //返回值
                    let return_type = get_type(&ts_fn.type_ann.type_ann);
                    return VarType::Func(list, Some(Box::new(return_type)), MethodKind::Method);
                }
                _ => {
                    dbg!("未处理参数:", fn_or_con);
                    panic!("未处理参数");
                }
            }
        }
        TsType::TsUnionOrIntersectionType(union_or_intersection) => {
            let ts_union_type = &union_or_intersection.to_owned().ts_union_type().unwrap();
            let types = &ts_union_type.types;
            let mut list = Vec::new();
            for item in types {
                let var_type = get_type(&item);
                list.push(var_type);
            }
            return VarType::List(list);
        }
        TsType::TsParenthesizedType(parenthesized) => {
            let var_type = get_type(&parenthesized.type_ann);
            return var_type;
        }
        TsType::TsArrayType(array) => {
            let var_type = get_type(&array.elem_type);
            return VarType::T("Array".to_string(), vec![var_type]);
        }
        TsType::TsMappedType(mapped) => {
            let key_type = &mapped.name_type.to_owned().unwrap();
            let value_type = &mapped.type_ann.to_owned().unwrap();
            let key_var_type = get_type(&key_type);
            let value_var_type = get_type(&value_type);
            return VarType::T("Map".to_string(), vec![key_var_type, value_var_type]);
        }
        _ => {
            return VarType::Type(TsKeywordTypeKind::TsAnyKeyword);
        }
    }
}

fn get_ts_qualified_name(ts_qualified: &TsQualifiedName) -> String {
    let left = get_ts_entity_name(&ts_qualified.left);
    let right = ts_qualified.right.sym.to_string();
    return format!("{}.{}", &left, &right);
}

fn get_ts_entity_name(entity_name: &TsEntityName) -> String {
    match entity_name {
        TsEntityName::TsQualifiedName(ts_qualified) => {
            return get_ts_qualified_name(ts_qualified);
        }
        TsEntityName::Ident(ident) => {
            return ident.sym.to_string();
        }
    }
}

///获取文件夹下所有实现IModuleData的类定义
fn get_module_data_files(path: &Path, excludes: &Vec<String>, debug: bool) -> Vec<ExportDefine> {
    let mut result = Vec::new();
    let dir = fs::read_dir(path).unwrap();
    for entry in dir.into_iter().flatten() {
        let entity_path = entry.path();
        if entity_path.is_dir() {
            let list = get_module_data_files(&entity_path, excludes, debug);
            result.extend(list);
        } else {
            let file_name = entity_path.file_name().unwrap().to_str().unwrap();

            let exclude = excludes.iter().any(|e| file_name.contains(e));
            if exclude {
                if debug {
                    println!("排除文件:{}", entity_path.to_str().unwrap().to_string());
                }
                continue;
            }
            //ts文件
            let ext = entity_path.extension().unwrap();
            if ext == "ts" {
                get_file_module_datas(&entity_path, &mut result);
            }
        }
    }
    result
}

fn get_file_module_datas(file: &PathBuf, result: &mut Vec<ExportDefine>) {
    let (script, module) = get_ts_module(file);

    let mut file_exports = Vec::new();
    //当前文件导入的内容
    let mut imports: HashMap<String, Vec<String>> = HashMap::new();
    for item in &module.body {
        if let ModuleItem::ModuleDecl(decl) = item {
            if let ModuleDecl::Import(import) = decl {
                // dbg!(import);
                let src = import.src.value.to_string();
                if !imports.contains_key(&src) {
                    imports.insert(src.clone(), Vec::new());
                }
                let list = imports.get_mut(&src).unwrap();
                for import_specifier in &import.specifiers {
                    let local = import_specifier.local();
                    list.push(local.sym.to_string());
                }
            }
        }
    }

    for item in &module.body {
        match item {
            //私有类
            ModuleItem::Stmt(stmt) => match stmt {
                Stmt::Decl(decl) => {
                    match decl {
                        Decl::Class(class_decl) => {
                            let mut class = ExportDefine::new();
                            class.name = class_decl.ident.sym.to_string();
                            class.path = file.to_str().unwrap().to_string();
                            class.script = get_script(&script, class_decl.span());
                            class.decl = Some(ExportDeclData::Class(class_decl.clone()));
                            file_exports.push(class);
                        }
                        Decl::TsInterface(ts_interface) => {
                            let interface_decl = &**ts_interface;
                            let mut interface = ExportDefine::new();
                            interface.name = interface_decl.id.sym.to_string();
                            interface.path = file.to_str().unwrap().to_string();
                            interface.script = get_script(&script, interface_decl.span());
                            interface.decl =
                                Some(ExportDeclData::Interface(interface_decl.clone()));
                            file_exports.push(interface);
                        }
                        Decl::TsEnum(ts_enum_box) => {
                            let ts_enum = &**ts_enum_box;
                            let mut export = ExportDefine::new();
                            export.name = ts_enum.id.sym.to_string();
                            export.path = file.to_str().unwrap().to_string();
                            export.decl = Some(ExportDeclData::Enum(ts_enum.clone()));
                            file_exports.push(export);
                        }
                        _ => {
                            // dbg!(decl);
                        }
                    }
                }
                _ => {
                    dbg!(file);
                }
            },
            //导出类
            ModuleItem::ModuleDecl(decl) => match decl {
                ModuleDecl::ExportDecl(export_decl) => {
                    let export_decl_decl = &export_decl.decl;
                    match export_decl_decl {
                        Decl::Class(class_decl) => {
                            let mut class = ExportDefine::new();
                            class.name = class_decl.ident.sym.to_string();
                            class.path = file.to_str().unwrap().to_string();
                            class.script = get_script(&script, class_decl.span());
                            class.decl = Some(ExportDeclData::Class(class_decl.clone()));
                            file_exports.push(class);
                        }
                        Decl::TsInterface(ts_interface) => {
                            let interface_decl = &**ts_interface;
                            let mut interface = ExportDefine::new();
                            interface.name = interface_decl.id.sym.to_string();
                            interface.path = file.to_str().unwrap().to_string();
                            interface.decl =
                                Some(ExportDeclData::Interface(interface_decl.clone()));
                            file_exports.push(interface);
                        }
                        Decl::TsEnum(ts_enum_box) => {
                            let ts_enum = &**ts_enum_box;
                            let mut export = ExportDefine::new();
                            export.name = ts_enum.id.sym.to_string();
                            export.path = file.to_str().unwrap().to_string();
                            export.decl = Some(ExportDeclData::Enum(ts_enum.clone()));
                            file_exports.push(export);
                        }
                        _ => {}
                    }
                }
                _ => {}
            },
        }
    }
    //如果单文件导出了多个类或接口，拆分后需要加入imports
    if file_exports.len() > 1 {
        //将内部类纳入imports
        for class in &file_exports {
            let src = format!("./{}", class.name);
            imports.insert(src, vec![class.name.to_string()]);
        }
    }
    for mut class in file_exports {
        class.imports = imports.clone();
        result.push(class);
    }
}

fn get_ts_fn_param(param: &TsFnParam) -> Option<VarData> {
    match param {
        TsFnParam::Ident(ident) => {
            let mut result = VarData::new();
            let type_ann = ident.type_ann.to_owned().unwrap();
            let ts_type = type_ann.type_ann;
            result.name = ident.id.sym.to_string();
            result.var_type = get_type(&ts_type);
            Some(result)
        }
        _ => {
            dbg!("接口中的方法参数未处理");
            dbg!(param);
            None
        }
    }
}

fn get_ts_module(file_path: &Path) -> (String, Module) {
    // dbg!("获取ts文件模块:", file_path);
    let source_text = std::fs::read_to_string(file_path).expect("读取文件失败!");
    let parsed_source = parse_module(ParseParams {
        specifier: deno_ast::ModuleSpecifier::parse("file:///my_file.ts").unwrap(),
        media_type: MediaType::TypeScript,
        text: source_text.clone().into(),
        capture_tokens: true,
        maybe_syntax: None,
        scope_analysis: false,
    })
    .expect("should parse");

    let module = parsed_source.program().as_module().unwrap().clone();
    (source_text, module)
}

///获取所有模块文件夹
fn get_all_module(path: &str) -> Result<Vec<String>, Box<dyn Error>> {
    // println!("获取路径下的所有模块文件夹：{}", path);
    let mut vec = Vec::new();
    let dir = fs::read_dir(path)?;
    for entry in dir.into_iter().flatten() {
        let entry_path = entry.path();
        // dbg!(&entry_path);
        if entry_path.is_dir() {
            let meta_file_path_str = format!("{}.meta", entry_path.to_str().unwrap());
            let meta_file_path = Path::new(&meta_file_path_str);
            if meta_file_path.exists() {
                let mut file = File::open(meta_file_path)?;
                let mut contents = String::new();
                //读取文件内容
                file.read_to_string(&mut contents)?;

                let json_value: Value = serde_json::from_str(&contents).expect("json解析失败!");

                //获取userData
                let user_data_op = json_value.get("userData");
                if user_data_op.is_none() {
                    continue;
                }
                let user_data = user_data_op.unwrap();

                let is_bundle = user_data.get("isBundle");
                //文件夹是AssetBundle
                if is_bundle.is_some() && is_bundle.unwrap().as_bool().unwrap() {
                    let module_path_str = format!(
                        "{}/Module_{}.ts",
                        entry_path.to_str().unwrap(),
                        entry_path.file_name().unwrap().to_str().unwrap()
                    );
                    let module_file_path = Path::new(&module_path_str);
                    if module_file_path.exists() {
                        vec.push(entry_path.to_str().unwrap().to_string());
                    }
                    continue;
                }
            }
            let list = get_all_module(entry_path.to_str().unwrap())?;
            vec.extend(list);
        }
    }
    Ok(vec)
}
