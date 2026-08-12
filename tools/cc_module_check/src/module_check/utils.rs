use std::{
    collections::HashMap,
    error::Error,
    fs::{self, File},
    io::Read,
    path::Path,
};

use deno_ast::{MediaType, ParseParams, parse_module, swc::ast::Module};
use serde_json::Value;

///获取所有asset bundle
pub fn get_all_ab(path: &str, result: &mut HashMap<String, String>) -> Result<(), Box<dyn Error>> {
    // println!("获取路径下的所有模块文件夹：{}", path);
    let dir = fs::read_dir(path)?;
    for entry in dir.into_iter().flatten() {
        let entry_path = entry.path();
        if entry_path.is_dir() {
            // dbg!(&entry_path);
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
                    let ab_name = entry_path
                        .file_name()
                        .unwrap()
                        .to_str()
                        .unwrap()
                        .to_string();
                    let dir = entry_path.to_str().unwrap().to_string();
                    result.insert(ab_name, dir);
                }
            }
            get_all_ab(entry_path.to_str().unwrap(), result)?;
        }
    }
    Ok(())
}

//获取该文件夹及子文件夹中的指定后缀文件地址列表
pub fn get_files_by_ext(
    dir: &str,
    ext: &str,
    result: &mut Vec<String>,
) -> Result<(), Box<dyn Error>> {
    let dir = fs::read_dir(dir)?;
    for entry in dir.into_iter().flatten() {
        let entry_path = entry.path();
        // dbg!(&entry_path);
        if entry_path.is_dir() {
            let sub_dir = entry_path.to_str().unwrap();
            get_files_by_ext(sub_dir, ext, result)?;
        } else {
            let e_ext = entry_path.extension().unwrap();
            if e_ext == ext {
                result.push(entry_path.to_str().unwrap().to_string());
            }
        }
    }
    Ok(())
}

pub fn get_ts_module(file_path: &str) -> Result<Module, Box<dyn Error>> {
    // dbg!("获取ts文件模块:", file_path);
    let path = Path::new(file_path);
    let source_text = std::fs::read_to_string(path).expect("读取文件失败!");
    let parsed_source = parse_module(ParseParams {
        specifier: deno_ast::ModuleSpecifier::parse("file:///my_file.ts").unwrap(),
        media_type: MediaType::TypeScript,
        text: source_text.clone().into(),
        capture_tokens: true,
        maybe_syntax: None,
        scope_analysis: false,
    })?;

    Ok(parsed_source.program().as_module().unwrap().clone())
}

/// 拼接路径并返回规范化后的完整路径
pub fn resolve_import_path(current_file: &str, relative_path: &str) -> Option<String> {
    let current_dir = Path::new(current_file).parent().unwrap();
    let base_path = current_dir.join(relative_path);

    let file_path = base_path.with_extension("ts");
    if file_path.exists() {
        // results.push(file_path);
        let abs_path = fs::canonicalize(file_path).unwrap();
        return Some(abs_path.to_string_lossy().to_string());
    }
    None
}
