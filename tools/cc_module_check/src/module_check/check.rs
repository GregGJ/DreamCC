use std::{collections::HashMap, error::Error};

use clap::Args;
use deno_ast::swc::ast::{ModuleDecl, ModuleItem};

use crate::module_check::utils::{
    get_all_ab, get_files_by_ext, get_ts_module, resolve_import_path,
};

#[derive(Args, Debug, Clone)]
pub struct ModuleCheckArgs {
    #[arg(short, long, help = "项目根目录")]
    project_dir: Option<String>,
    #[arg(short, long, value_delimiter = ',', help = "公共模块列表(AssetBundle名称)")]
    modules: Vec<String>,
    #[arg(short, long, value_delimiter = ',', help = "排除的文件夹(文件夹绝对地址)")]
    exclusion_list: Vec<String>,
}

pub async fn module_check(args: ModuleCheckArgs) -> Result<(), Box<dyn Error>> {
    if args.project_dir.is_none() {
        panic!("Project dir is empty ")
    }

    println!("模块检测开始");
    //项目地址
    let dir = args.project_dir.unwrap();

    //公共模块列表
    let public_modules = args.modules.clone();

    //bundle列表
    let mut all_abs: HashMap<String, String> = HashMap::new();
    get_all_ab(&dir, &mut all_abs)?;

    //排除模块地址列表
    let mut e_m_list: Vec<String> = Vec::new();
    //排除掉公共模块
    if !public_modules.is_empty() {
        all_abs.retain(|key, value| {
            if public_modules.contains(key) {
                e_m_list.push(value.clone());
                false
            } else {
                true
            }
        });
    }

    //添加到排除列表
    if !args.exclusion_list.is_empty() {
        e_m_list.extend(args.exclusion_list);
    }

    //依次检测
    for value in all_abs.values() {
        check_module(value, &e_m_list)?;
    }
    // dbg!(all_abs);
    println!("模块检测完成");
    Ok(())
}

//检测该模块是否引用了外部模块
fn check_module(module_dir: &str, exclusion_list: &[String]) -> Result<(), Box<dyn Error>> {
    //获取该模块下的所有ts文件
    let mut all_ts_files: Vec<String> = Vec::new();
    get_files_by_ext(module_dir, "ts", &mut all_ts_files)?;

    for ts_file in &all_ts_files {
        let module_define = get_ts_module(ts_file)?;
        // dbg!(ts_file);

        for item in &module_define.body {
            if let ModuleItem::ModuleDecl(decl) = item
                && let ModuleDecl::Import(import) = decl
            {
                // dbg!(import);
                let src = import.src.value.as_str().unwrap();
                // dbg!(ts_file, src);
                let result = resolve_import_path(ts_file, src);

                if let Some(path) = result
                    && !path.contains(module_dir)
                {
                    let ss = exclusion_list.iter().find(|x| path.contains(*x));
                    if ss.is_none() {
                        println!("  跨模块引用 {}   =>  {}", ts_file, path);
                    }
                }
            }
        }
    }
    // println!("Checked:{} {}", module_name, module_dir);
    Ok(())
}
