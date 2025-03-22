use std::{
    collections::HashMap,
    error::Error,
    fs::{self, File},
    io::{self, Read, Write},
    path::{Path, PathBuf},
};

use serde::de::DeserializeOwned;
use zip::{write::SimpleFileOptions, ZipWriter};

///获取http服务器配置
pub fn get_local_file_json<T: DeserializeOwned>(path: &Path) -> T {
    let mut file = match File::open(path) {
        Err(why) => panic!("couldn't open {}: {}", path.display(), why),
        Ok(file) => file,
    };

    // 读取文件内容到字符串中
    let mut s = String::new();
    match file.read_to_string(&mut s) {
        Err(why) => panic!("couldn't read {}: {}", path.display(), why),
        Ok(_) => println!("successfully read {}", path.display()),
    }

    // 解析JSON字符串为Rust数据结构
    let config: T = match serde_json::from_str(&s) {
        Err(why) => panic!("couldn't parse {}: {}", path.display(), why),
        Ok(config) => config,
    };
    config
}

///查找目录中的所有文件
pub fn find_files(dir: &Path) -> std::io::Result<Vec<PathBuf>> {
    let mut files = Vec::new();
    // 读取目录中的所有条目
    if let Ok(entries) = fs::read_dir(dir) {
        for entry in entries {
            if let Ok(entry) = entry {
                let path = entry.path();
                if path.is_dir() {
                    // 如果是目录，则递归查找
                    let sub_xlsx_files = find_files(&path)?;
                    files.extend(sub_xlsx_files);
                } else {
                    files.push(path);
                }
            }
        }
    }
    Ok(files)
}

pub fn is_dir_empty(path: &Path) -> Result<bool, Box<dyn Error>> {
    // 尝试读取目录中的条目
    let mut dir_iter = fs::read_dir(path)?;

    // 使用`next`方法来尝试获取迭代器中的第一个条目
    match dir_iter.next() {
        // 如果没有条目，返回`Ok(true)`表示目录为空
        None => Ok(true),
        // 如果有条目，即使只有一个，也返回`Ok(false)`表示目录不为空
        Some(_) => Ok(false),
    }
}

///打包zip文件
pub fn pack_zip(output_path: &Path, files: &HashMap<String, String>) -> Result<(), Box<dyn Error>> {
    if output_path.exists() {
        fs::remove_file(output_path).unwrap();
    }

    let file = File::create(output_path).unwrap();
    let mut zip = ZipWriter::new(file);
    for (path, name_in_zip) in files {
        //文件
        let mut file_to_add = File::open(&path).unwrap();
        //zip中添加一个新的条目
        let options = SimpleFileOptions::default()
            .compression_method(zip::CompressionMethod::Stored)
            .unix_permissions(0o755);

        zip.start_file(name_in_zip, options)?;

        let mut buffer = Vec::new();
        file_to_add.read_to_end(&mut buffer)?;
        zip.write_all(&buffer)?;
    }
    zip.finish()?;
    Ok(())
}

/**
 * 写文件
 */
pub fn write_file(path: &str, data: &str) {
    let path = Path::new(path);
    if path.exists() {
        fs::remove_file(path).expect(format!("删除文件失败{}", path.to_str().unwrap()).as_str());
    }
    let mut file =
        File::create(path).expect(format!("创建文件失败{}", path.to_str().unwrap()).as_str());
    file.write_all(data.as_bytes()).expect("写入文件失败");
}

pub fn get_relative_path_str(root: &str, path: &str) -> String {
    let root_path = Path::new(root);
    let path_path = Path::new(path);
    get_relative_path(root_path, path_path)
}

pub fn get_relative_path(root: &Path, path: &Path) -> String {
    path.strip_prefix(&root)
        .unwrap()
        .to_str()
        .unwrap()
        .to_string()
}

pub fn get_file_name(path: &Path) -> String {
    path.file_name().unwrap().to_str().unwrap().to_string()
}

pub fn get_file_name_str(path_str: &str) -> String {
    let path = Path::new(path_str);
    get_file_name(path)
}

/**
 * 返回首字母大写的字符串
 */
pub fn capitalize_first_letter(s: &str) -> String {
    let mut c = s.chars();
    match c.next() {
        None => String::new(),
        Some(f) => {
            let rest = c.as_str();
            let first = f.to_uppercase().next().unwrap_or(f); // 如果 f 不是字母，则保持原样
            let first_str = first.to_string();

            // 如果首字母已经是大写或者不是字母，则直接返回原字符串
            if first == f || !f.is_ascii_alphabetic() {
                return (first_str.to_owned() + rest).to_owned();
            }
            // 否则，将首字母大写并拼接上剩余的字符串
            format!("{}{}", first_str, &rest.to_lowercase())
        }
    }
}

///清理指定文件夹下的所有内容
pub fn clear_directory(dir_path: &str, ext: &str) -> io::Result<()> {
    // 获取目录的元数据信息
    let metadata = fs::metadata(dir_path)?;

    // 确保提供的是一个目录
    if !metadata.is_dir() {
        return Err(io::Error::new(
            io::ErrorKind::InvalidInput,
            format!("{} is not a directory", dir_path),
        ));
    }

    // 读取目录下的所有条目
    let entries = fs::read_dir(dir_path)?;

    // 遍历所有条目并删除它们
    for entry in entries {
        let entry = entry?;
        let path = entry.path();
        let metadata = fs::metadata(&path)?;

        if metadata.is_file() {
            let file_ext = path.extension().unwrap();
            if file_ext == ext {
                fs::remove_file(&path)?;
            }
        } else if metadata.is_dir() {
            clear_directory(&path.to_str().unwrap(), ext)?;
        }
    }
    Ok(())
}

pub fn collect_parent_dirs(path: &Path) -> Vec<PathBuf> {
    if let Some(parent) = path.parent() {
        let mut parent_dirs = collect_parent_dirs(parent);
        parent_dirs.push(parent.to_path_buf());
        parent_dirs
    } else {
        vec![]
    }
}

///根据将对路径将a/b/c转换为a.b.c
pub fn get_class_path(package: &str, class_file: &str, file_name: &str) -> String {
    let mut result = String::new();
    let path = Path::new(class_file);
    let parent = path.parent().unwrap();
    //相对路径
    let relative_path = parent.strip_prefix(package).expect(&format!(
        "路径转换失败：{},{},{}",
        package, class_file, file_name
    ));
    let relative_path_str = relative_path.to_str().unwrap();
    if !relative_path_str.is_empty() {
        let mut list = Vec::new();
        let mut dirs = collect_parent_dirs(&relative_path);
        dirs.reverse();
        dirs.push(PathBuf::from(parent.file_name().unwrap()));
        for dir in dirs {
            let dir_name = dir.to_str().unwrap().to_string();
            if dir_name.is_empty() {
                continue;
            }
            list.push(dir_name);
        }
        result.push_str(&list.join("."));
        result.push_str(&format!(".{}", file_name));
        return result;
    } else {
        return file_name.to_string();
    }
}

///根据一个绝对路径 和一个相对路径合成一个新的路径
pub fn get_new_path(root: &str, relative_path: &str) -> String {
    let root_path = Path::new(root);
    let new_root = if root_path.is_dir() {
        root
    } else {
        root_path.parent().unwrap().to_str().unwrap()
    };
    if relative_path.starts_with("./") {
        return format!("{}\\{}", &new_root, &relative_path.replace("./", ""));
    }
    if relative_path.starts_with("../") {
        let list: Vec<&str> = relative_path.matches("../").collect();
        let count = list.len();
        let mut parent = Path::new(new_root);
        for _ in 0..count {
            parent = parent.parent().unwrap();
        }
        return format!(
            "{}\\{}",
            parent.to_str().unwrap(),
            relative_path.replace("../", "")
        );
    }
    panic!("路径错误{}  {}", root, relative_path);
}

pub fn get_class_path_dirs(package: &str, class_file: &str) -> Vec<String> {
    let mut result = Vec::new();
    let path = Path::new(class_file);
    let parent = path.parent().unwrap();
    //相对路径
    let relative_path = parent.strip_prefix(package).unwrap();
    let relative_path_str = relative_path.to_str().unwrap();
    if !relative_path_str.is_empty() {
        let mut dirs = collect_parent_dirs(&relative_path);
        dirs.reverse();
        dirs.push(PathBuf::from(parent.file_name().unwrap()));
        for dir in dirs {
            if !dir.file_name().is_none() {
                result.push(dir.file_name().unwrap().to_str().unwrap().to_string());
            }
        }
    }
    result
}

pub fn get_tab_str(tab_num: usize) -> String {
    let mut tab_str = String::new();
    for _ in 0..tab_num {
        tab_str.push_str("   ");
    }
    tab_str
}
