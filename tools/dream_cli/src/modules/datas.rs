use std::{
    collections::{HashMap, HashSet},
    path::Path,
};

use deno_ast::swc::ast::{ClassDecl, MethodKind, TsEnumDecl, TsInterfaceDecl, TsKeywordTypeKind};
use linked_hash_map::LinkedHashMap;

use crate::utils::file_utils::{
    capitalize_first_letter, get_class_path, get_new_path, get_relative_path_str, get_tab_str,
    write_file,
};

use super::{export2ts::Export2Ts, utils::is_ts_keyword_type};

#[derive(Debug)]
pub struct ExportDefine {
    pub name: String,
    pub path: String,
    pub script: Vec<String>,
    pub imports: HashMap<String, Vec<String>>,
    pub decl: Option<ExportDeclData>,
}

impl ExportDefine {
    pub fn new() -> Self {
        ExportDefine {
            name: String::new(),
            path: String::new(),
            script: Vec::new(),
            imports: HashMap::new(),
            decl: None,
        }
    }
}

#[derive(Debug)]
pub enum ExportDeclData {
    Class(ClassDecl),
    Interface(TsInterfaceDecl),
    Enum(TsEnumDecl),
}

#[derive(Debug)]
pub struct AssetBundleData {
    pub name: String,
    pub path: String,
    pub exports: Vec<ExportData>,
}

impl AssetBundleData {
    pub fn new(name: &str, path: &str) -> Self {
        AssetBundleData {
            name: name.to_string(),
            path: path.to_string(),
            exports: Vec::new(),
        }
    }

    pub fn export(&mut self, export_config: &Export2Ts) {
        let mut result = String::new();
        for export in &mut self.exports {
            if export_config.debug {
                println!("      {}", &export.name);
            }
            export.nick_name = get_class_path(&self.path, &export.path, &export.name);
        }
        //合并导入
        let mut imports = Imports::new();
        for export in &self.exports {
            if export.is_empty() {
                continue;
            }
            // dbg!(&export.path,&export.imports);
            imports.merge(&export.imports);
        }
        if !imports.is_empty() {
            for (src, list) in &imports.new_imports {
                //是否属于公共包
                let in_package = export_config.packages.iter().any(|x| src.contains(x));
                //属于公共包||中间件
                if in_package || src.contains(&export_config.output_file_name) {
                    let mut class = Vec::new();
                    for imp in list {
                        class.push(imp.to_string());
                    }
                    let new_path = src.replace("../", "");
                    let code =
                        format!("import {{{}}} from \"../{}\";\n", class.join(","), new_path);
                    result.push_str(&code);
                    continue;
                } else {
                    //外部模块
                    if src.contains(&export_config.input_file_name) {
                        continue;
                    }
                    //内部模块
                    if src.starts_with(".") {
                        continue;
                    }
                }
                let mut class = Vec::new();
                for imp in list {
                    class.push(imp.to_string());
                }
                let code = format!("import {{{}}} from \"{}\";\n", class.join(","), src);
                result.push_str(&code);
            }
        }

        result.push_str(&format!(
            "   export namespace {}_{} {{\n",
            export_config.namespace,
            &capitalize_first_letter(&self.name)
        ));

        let export_list = get_asset_bundle_cut(&self, &self.exports);
        for (key, value) in &export_list {
            let mut tab_idx: usize = 1;
            //命名空间开头
            let parts: Vec<&str> = key.split("\\").collect();
            for part in parts {
                if !part.is_empty() {
                    result.push_str(&format!(
                        "{}export namespace {} {{\n",
                        vec!["\t"; tab_idx].join(""),
                        part
                    ));
                    tab_idx += 1;
                }
            }
            for export in value {
                let code = export.generating_interface_code(export_config, self, tab_idx);
                result.push_str(&code);
            }
            //命名空间结尾
            for i in (1..tab_idx).rev() {
                result.push_str(&format!("{}}}\n", vec!["\t"; i].join("")));
            }
            // result.push_str(&value);
        }
        result.push_str("}");
        //获取文件相对路径
        let file_path = format!(
            "{}\\{}_{}.ts",
            &export_config.output,
            export_config.namespace,
            &capitalize_first_letter(&self.name)
        );
        write_file(&file_path, &result);
    }
}

///拆分列表
fn get_asset_bundle_cut(
    ab: &AssetBundleData,
    list: &Vec<ExportData>,
) -> LinkedHashMap<String, Vec<ExportData>> {
    let mut result: LinkedHashMap<String, Vec<ExportData>> = LinkedHashMap::new();
    for export in list {
        let parent = Path::new(&export.path).parent().unwrap();
        let r_path = get_relative_path_str(&ab.path, parent.to_str().unwrap());
        if !result.contains_key(&r_path) {
            result.insert(r_path.clone(), Vec::new());
        }
        let list = result.get_mut(&r_path).unwrap();
        list.push(export.clone());
    }
    result
}

#[derive(Debug, Clone)]
pub struct EnumData {
    pub name: String,
    pub value: Option<String>,
}

impl EnumData {
    pub fn new(name: &str, value: Option<String>) -> Self {
        EnumData {
            name: name.to_string(),
            value: value,
        }
    }
}

#[derive(Debug, Clone)]
pub struct ExportData {
    ///类名
    pub name: String,
    ///别名
    pub nick_name: String,
    ///文件地址
    pub path: String,
    pub sources: HashMap<String, Vec<String>>,
    pub imports: Imports,
    pub used_types: HashSet<String>,
    ///注释
    pub comments: HashMap<String, String>,
    pub propertys: HashMap<String, VarType>,
    pub handlers: HashMap<String, VarType>,
    ///枚举定义
    pub enums: Vec<EnumData>,
    ///父类
    pub super_class: Option<VarType>,
    ///继承的接口
    pub implements: Option<Vec<VarType>>,
}

impl ExportData {
    pub fn new(name: &str, path: &str) -> Self {
        ExportData {
            name: name.to_string(),
            nick_name: name.to_string(),
            path: path.to_string(),
            sources: HashMap::new(),
            imports: Imports::new(),
            used_types: HashSet::new(),
            comments: HashMap::new(),
            propertys: HashMap::new(),
            handlers: HashMap::new(),
            enums: Vec::new(),
            super_class: None,
            implements: None,
        }
    }

    ///是否为空
    pub fn is_empty(&self) -> bool {
        self.propertys.is_empty() && self.handlers.is_empty() && self.enums.is_empty()
    }

    ///生成接口代码
    fn generating_interface_code(
        &self,
        export: &Export2Ts,
        ab: &AssetBundleData,
        tab_idx: usize,
    ) -> String {
        let mut result = String::new();
        //接口
        if self.enums.is_empty() {
            let mut interfaces = Vec::new();
            //有父类
            if self.super_class.is_some() {
                let var_type = self.super_class.as_ref().unwrap();
                let super_class_name =
                    self.get_property_type(ab, "super_class", var_type, &export);

                //特殊处理，如果是UI_开头
                if super_class_name.starts_with("UI_"){
                    return String::new();
                }

                match var_type {
                    VarType::String(source_name) => {
                        if self.imports.imports.contains_key(source_name) {
                            let src = self.imports.imports.get(source_name).unwrap();
                            //包内，其他包
                            if src.starts_with(".") {
                                interfaces.push(super_class_name);
                            } else {
                                //事件分发器特殊处理
                                if source_name == "EventDispatcher" {
                                    interfaces.push("IEventDispatcher".to_string());
                                }
                            }
                        }
                    }
                    _ => {}
                }
            }
            //有实现接口
            if self.implements.is_some() {
                let implements = self.implements.as_ref().unwrap();
                for implement in implements {
                    let var_type = self.get_property_type(ab, "implements", implement, &export);
                    if !interfaces.contains(&var_type) {
                        interfaces.push(var_type);
                    }
                }
            }
            if interfaces.is_empty() {
                result.push_str(&format!(
                    "{}export interface {} {{\n",
                    get_tab_str(tab_idx),
                    self.name
                ));
            } else {
                result.push_str(&format!(
                    "{}export interface {} extends {} {{\n",
                    get_tab_str(tab_idx),
                    self.name,
                    interfaces.join(",")
                ));
            }
            //属性
            if !self.propertys.is_empty() {
                for (key, value) in &self.propertys {
                    //注释
                    if self.comments.contains_key(key) {
                        let comment = self.comments.get(key).unwrap();
                        result.push_str(&comment);
                    }
                    //属性
                    let property_code = format!(
                        "{}{}",
                        get_tab_str(tab_idx + 1),
                        self.get_property_code(ab, key, value, &export)
                    );
                    result.push_str(&property_code);
                    result.push_str("\n");
                }
            }
            //方法
            if !self.handlers.is_empty() {
                for (key, value) in &self.handlers {
                    //注释
                    if self.comments.contains_key(key) {
                        let comment = self.comments.get(key).unwrap();
                        result.push_str(&comment);
                    }
                    let func_code = format!(
                        "{}{}",
                        get_tab_str(tab_idx + 1),
                        self.get_func_code(ab, key, value, &export)
                    );
                    result.push_str(&func_code);
                    result.push_str("\n");
                }
            }
        } else {
            //枚举
            result.push_str(&format!(
                "{}export enum {} {{\n",
                get_tab_str(tab_idx),
                self.name
            ));
            for element in &self.enums {
                if element.value.is_none() {
                    result.push_str(&format!("    {},\n", element.name));
                } else {
                    result.push_str(&format!(
                        "    {} = {},\n",
                        element.name,
                        element.value.as_ref().unwrap()
                    ));
                }
            }
        }
        result.push_str(&format!("{}}}\n", get_tab_str(tab_idx)));
        result
    }

    fn get_property_code(
        &self,
        ab: &AssetBundleData,
        name: &str,
        var_type: &VarType,
        export: &Export2Ts,
    ) -> String {
        format!(
            "{}:{};",
            name,
            self.get_property_type(ab, name, var_type, export)
        )
    }

    fn get_property_type(
        &self,
        ab: &AssetBundleData,
        var_name: &str,
        var_type: &VarType,
        export: &Export2Ts,
    ) -> String {
        match var_type {
            VarType::String(type_name) | VarType::QualifiedName(_, type_name) => {
                let name = type_name.clone();
                //ts内部类型
                if is_ts_keyword_type(&name) {
                    return name;
                }
                //如果是xxx.xxx格式(命名空间引用)
                let is_namespace = !name.starts_with(".") && name.contains(".");
                if is_namespace {
                    return name;
                }
                //在导入列表中
                if self.imports.imports.contains_key(&name) {
                    let src = self.imports.imports.get(&name).unwrap();
                    let in_package = export.packages.iter().any(|x| src.contains(x));
                    //(属于公共包)
                    if in_package {
                        return name;
                    }
                    if src.contains(&export.input_file_name)
                        || src.contains(&export.output_file_name)
                    {
                        // panic!("发现非法引用:{}文件中引用{}",&self.path,&src);
                        return name;
                    }
                    //本包
                    if src.starts_with(".") {
                        let import_path = get_new_path(&self.path, &src);
                        let class_name = get_class_path(&ab.path, &import_path, &name);
                        return class_name;
                    }
                }
                return name;
            }
            //ts内置类型，如string,number,bool等
            VarType::Type(keyword_type) => {
                let name = self.get_keyword_type(keyword_type);
                // dbg!(var_name,&name);
                return name;
            }
            VarType::T(key, types) => {
                let mut var_types = Vec::new();
                for var_type in types {
                    var_types.push(self.get_property_type(ab, key, var_type, export));
                }
                return format!("{}<{}>", key, var_types.join(","));
            }
            VarType::List(list) => {
                let mut types = Vec::new();
                for var_type in list {
                    types.push(self.get_property_type(ab, var_name, var_type, export));
                }
                return types.join("|");
            }
            VarType::Func(list, return_type, kind) => {
                let mut code = String::from("((");
                let mut func_props = Vec::new();
                match kind {
                    MethodKind::Method => {
                        for var_data in list {
                            let v = format!(
                                "{}:{}",
                                var_data.name,
                                self.get_property_type(ab, var_name, &var_data.var_type, export)
                            );
                            func_props.push(v);
                        }
                        code.push_str(&func_props.join(","));
                        if return_type.is_none() {
                            code.push_str(")=>void");
                        } else {
                            code.push_str(")=>");
                            let var_type = &*return_type.as_ref().unwrap();
                            let var_type_str =
                                self.get_property_type(ab, var_name, var_type, export);
                            code.push_str(&var_type_str);
                        }
                        code.push_str(")");
                    }
                    _ => {
                        panic!("属性类型为方法时，方法标记为getset??{}", var_name);
                    }
                }

                return code;
            }
        }
    }

    fn get_func_code(
        &self,
        ab: &AssetBundleData,
        name: &str,
        var_type: &VarType,
        exports: &Export2Ts,
    ) -> String {
        let mut result = String::new();
        match var_type {
            VarType::Func(_, _, kind) => match kind {
                MethodKind::Method => {
                    result.push_str(&format!(
                        "{}{}",
                        name,
                        self.get_func_type(ab, name, var_type, exports,false)
                    ));
                }
                MethodKind::Getter => {
                    result.push_str(&format!(
                        "get {}{}",
                        name,
                        self.get_func_type(ab, name, var_type, exports,true)
                    ));
                }
                MethodKind::Setter => {
                    result.push_str(&format!(
                        "set {}{}",
                        name,
                        self.get_func_type(ab, name, var_type, exports,true)
                    ));
                }
            },
            _ => panic!("函数类型错误!"),
        }
        result
    }

    fn get_func_type(
        &self,
        ab: &AssetBundleData,
        func_name: &str,
        var_type: &VarType,
        exports: &Export2Ts,
        is_set:bool
    ) -> String {
        if let VarType::Func(list, return_type, _kind) = var_type {
            let mut code = String::from("(");
            let mut func_props = Vec::new();
            for var_data in list {
                //...args形式
                if var_data.is_reset {
                    let v = format!(
                        "...{}:{}[]",
                        var_data.name,
                        self.get_property_type(ab, func_name, &var_data.var_type, exports)
                    );
                    func_props.push(v);
                } else if var_data.optional {
                    //可选参数
                    let v = format!(
                        "{}?:{}",
                        var_data.name,
                        self.get_property_type(ab, func_name, &var_data.var_type, exports)
                    );
                    func_props.push(v);
                } else {
                    let v = format!(
                        "{}:{}",
                        var_data.name,
                        self.get_property_type(ab, func_name, &var_data.var_type, exports)
                    );
                    func_props.push(v);
                }
            }
            code.push_str(&func_props.join(","));
            if return_type.is_none() {
                if is_set{
                    code.push_str(");");
                }else{
                    code.push_str("):void");
                }
            } else {
                code.push_str("):");
                let var_type = &*return_type.as_ref().unwrap();
                let var_type_str = self.get_property_type(ab, func_name, var_type, exports);
                code.push_str(&var_type_str);
            }
            return code;
        } else {
            panic!("函数类型错误!")
        }
    }

    fn get_keyword_type(&self, ts_type: &TsKeywordTypeKind) -> String {
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
}

#[derive(Debug, Clone)]
pub struct Imports {
    pub imports: HashMap<String, String>,
    pub new_imports: HashMap<String, Vec<String>>,
}

impl Imports {
    pub fn new() -> Self {
        Imports {
            imports: HashMap::new(),
            new_imports: HashMap::new(),
        }
    }

    ///合并
    pub fn merge(&mut self, imports: &Imports) {
        for (class, src) in &imports.imports {
            if !self.imports.contains_key(class) {
                self.imports.insert(class.to_string(), src.to_string());
                let op = self.new_imports.get(src);
                if op.is_none() {
                    self.new_imports.insert(src.to_string(), vec![]);
                }
                let list = self.new_imports.get_mut(src).unwrap();
                list.push(class.to_string());
            }
        }
    }

    pub fn is_empty(&self) -> bool {
        self.imports.is_empty()
    }
}

#[derive(Debug, Clone)]
pub struct VarData {
    ///变量名称
    pub name: String,
    ///是否可选
    pub optional: bool,
    pub is_reset: bool,
    ///变量类型
    pub var_type: VarType,
}
impl VarData {
    pub fn new() -> Self {
        VarData {
            name: String::new(),
            optional: false,
            is_reset: false,
            var_type: VarType::String(String::new()),
        }
    }
}

#[derive(Debug, Clone)]
pub enum VarType {
    String(String),
    QualifiedName(String, String),
    Type(TsKeywordTypeKind),
    T(String, Vec<VarType>),
    List(Vec<VarType>),
    Func(Vec<VarData>, Option<Box<VarType>>, MethodKind),
}
