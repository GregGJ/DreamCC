use std::{
    char, cmp,
    error::Error,
    fs::{self, File},
    io::Write,
    path::{Path, PathBuf},
    sync::{mpsc, Arc},
    thread,
    time::Instant,
};

use clap::Args;
use serde_json::{Map, Number, Value};
use umya_spreadsheet::Worksheet;

use super::{
    code_generater::{CodeGenerater, TsCodeGenerater},
    datas::{ExcelDataType, HeadData},
};

#[derive(Args, Debug, Clone)]
pub struct ExcelToJsonArgs {
    #[arg(short, long, help = "输入")]
    input: Option<String>,
    #[arg(short, long, help = "输出")]
    output: Option<String>,

    #[arg(short, long, help = "是否导出代码定义", default_value = "true")]
    a_output_code: Option<bool>,
    #[arg(short, long, help = "是否导出配置", default_value = "true")]
    b_output_config: Option<bool>,

    #[arg(short, long, help = "代码导出目录")]
    c_code_output_path: Option<String>,

    #[arg(short, long, default_value = "1", help = "标题行索引")]
    v_title_idx: Option<u32>,
    #[arg(short, long, default_value = "2", help = "类型行索引")]
    w_type_idx: Option<u32>,
    #[arg(short, long, default_value = "3", help = "注释行索引")]
    x_comment_idx: Option<u32>,
    #[arg(short, long, default_value = "5", help = "数据行索引")]
    y_data_idx: Option<u32>,
    #[arg(short, long, help = "分隔符", default_value = ",")]
    z_separator: Option<char>,
}

#[derive(Debug, Clone)]
pub struct ExportInfo {
    pub input: String,
    pub output: String,

    pub output_code: bool,
    pub output_config: bool,
    pub code_output_path: String,

    pub type_idx: u32,
    pub title_idx: u32,
    pub comment_idx: u32,
    pub data_idx: u32,
    pub separator: char,
}

impl ExportInfo {
    pub fn new(
        input: String,
        output: String,
        output_code: bool,
        output_config: bool,
        code_output_path: String,
        type_idx: u32,
        title_idx: u32,
        comment_idx: u32,
        data_idx: u32,
        separator: char
    ) -> ExportInfo {
        ExportInfo {
            input,
            output,

            output_code,
            output_config,
            code_output_path,

            type_idx,
            title_idx,
            comment_idx,
            data_idx,
            separator,
        }
    }
}

struct Msg {
    code_str: String,
    enum_str: String,
}

impl Msg {
    fn is_empty(&self) -> bool {
        self.code_str.is_empty() && self.enum_str.is_empty()
    }
}

///excle配置表导出json
pub async fn excel2json(args: ExcelToJsonArgs) -> Result<(), Box<dyn Error>> {
    if args.input.is_none() {
        panic!("请输入工作空间");
    }
    if args.output.is_none() {
        panic!("请输入excel文件夹路径");
    }

    let input = args.input.unwrap();
    let output = args.output.unwrap();

    let output_code = args.a_output_code.unwrap();
    let output_config = args.b_output_config.unwrap();

    let code_output_path = if args.c_code_output_path.is_some() {
        args.c_code_output_path.unwrap()
    } else {
        output.clone()
    };

    let title_idx = args.v_title_idx.unwrap();
    let type_idx = args.w_type_idx.unwrap();
    let comment_idx = args.x_comment_idx.unwrap();
    let data_idx = args.y_data_idx.unwrap();
    let separator = args.z_separator.unwrap();

    let info = Arc::new(ExportInfo::new(
        input,
        output,
        output_code,
        output_config,
        code_output_path,
        type_idx,
        title_idx,
        comment_idx,
        data_idx,
        separator,
    ));

    // dbg!(&info);
    //excels导出json与代码定义文件
    let code_generater = TsCodeGenerater {};
    export(&info, Arc::new(code_generater));
    Ok(())
}

fn export(info: &Arc<ExportInfo>, generater: Arc<dyn CodeGenerater>) {
    println!("Start Export!");
    let start = Instant::now();
    //获取所有xlsx文件
    let dir_path = Path::new(&info.input);
    if dir_path.is_file() {
        panic!("输入路径是文件");
    }
    let files = find_xlsx_files(&dir_path).unwrap();

    let mut code_str = String::from("declare namespace Config {\n");
    let mut enum_str = generater.generate_enum_head(0);

    for file in files {
        export_xlsx_file(&info, &file, &generater, &mut code_str, &mut enum_str);
    }
    enum_str.push_str(&generater.generate_end(1));
    code_str.push_str(&generater.generate_end(1));

    if info.output_code {
        //写入枚举文件
        let enum_file_path = format!("{}\\ConfigKeys.ts", info.code_output_path);
        write_txt_file(&enum_file_path, &enum_str);

        let file_path = format!("{}\\Configs.d.ts", info.code_output_path);
        write_txt_file(&file_path, &code_str);
    }

    let end = Instant::now();
    let duration = end - start;
    println!("Export Complete,Total time:{}s", duration.as_secs());
}

fn export_xlsx_file(
    info: &Arc<ExportInfo>,
    file: &PathBuf,
    generater: &Arc<dyn CodeGenerater>,
    code_str: &mut String,
    enum_str: &mut String,
) {
    println!("Export file:{}", file.to_str().unwrap());

    let temp_file_name = file
        .file_name()
        .unwrap()
        .to_str()
        .unwrap()
        .replace(".xlsx", "");

    let file_name = get_file_name(&temp_file_name);

    code_str.push_str(&generater.generate_head(1, &file_name));

    let mut book = umya_spreadsheet::reader::xlsx::lazy_read(file).unwrap();
    let sheets = book.get_sheet_collection_mut();

    // 总共要运行的线程数
    let total_threads = sheets.len() as usize;
    if total_threads == 0 {
        return;
    }
    // 每批要运行的线程数
    let batch_size = 6;
    // //通讯频道
    let (tx, rx) = mpsc::channel();
    let mut handlers = Vec::new();
    let mut index = 0;
    for batch in (0..total_threads).step_by(batch_size) {
        let batch_end = cmp::min(batch + batch_size, total_threads);
        //创建当前批次线程
        for i in batch..batch_end {
            //通讯频道
            let thread_tx = tx.clone();
            //表单数据
            let sheet = sheets.get(i).unwrap();
            let thread_sheet = Arc::new(sheet.clone());
            let thread_export_info = Arc::clone(info);
            let file_name = file_name.to_string();
            let thread_generater = Arc::clone(generater);
            let handler = thread::spawn(move || {
                export_sheet(
                    &file_name,
                    &thread_sheet,
                    &thread_export_info,
                    &thread_generater,
                    thread_tx,
                );
            });
            handlers.push(handler);
        }
        for join_handle in handlers.drain(..(batch_end - batch)) {
            join_handle.join().unwrap();
        }
        while let Ok(msg) = rx.try_recv() {
            index += 1;
            if !msg.is_empty() {
                code_str.push_str(&msg.code_str);
                enum_str.push_str(&msg.enum_str);
            }
            //全部完成
            if index >= total_threads {
                // drop(tx);
                code_str.push_str(&generater.generate_end(1));
                break;
            }
        }
    }
}

fn export_sheet(
    file_name: &str,
    sheet: &Arc<Worksheet>,
    info: &Arc<ExportInfo>,
    generater: &Arc<dyn CodeGenerater>,
    sender: mpsc::Sender<Msg>,
) {
    let sheet_name = get_file_name(sheet.get_name());

    //表名为空或为Sheet开头的不导出数据文件
    if sheet_name.is_empty() || sheet_name.contains("Sheet") {
        let msg = Msg {
            code_str: String::new(),
            enum_str: String::new(),
        };
        sender.send(msg).unwrap();
        return;
    }

    println!("  Sheet:{}\\{}=>{}", info.output, file_name, sheet_name);

    //表头数据
    let head_datas = get_head_list(&sheet, info);
    //说明没有数据需要导出
    let data_len = sheet.get_highest_row();
    if info.output_config && info.data_idx < data_len {
        let mut sheet_vecs = Vec::new();
        for i in info.data_idx..data_len + 1 {
            let json_data = create_row_json_data(&sheet, i, info, &head_datas);
            if !json_data.is_empty() {
                sheet_vecs.push(json_data);
            }
        }
        export_sheet_json(file_name, &sheet_name, &sheet_vecs, info);
    }

    //通知主线程数据生成完毕
    let msg = Msg {
        code_str: generater.generate(2, &sheet_name, &head_datas),
        enum_str: generater.generate_enum(2, file_name, &sheet_name),
    };
    sender.send(msg).unwrap();
}

fn export_sheet_json(
    file_name: &str,
    sheet_name: &str,
    sheet_vecs: &Vec<Map<String, Value>>,
    info: &Arc<ExportInfo>,
) {
    let dir_str = format!("{}\\{}", &info.output, file_name);
    let dir_path = Path::new(&dir_str);
    if !dir_path.exists() {
        fs::create_dir(dir_path).expect(format!("创建目录失败{}", &dir_str).as_str());
    }
    let file_path_str = format!("{}\\{}\\{}.json", &info.output, file_name, sheet_name);
    let file_path = Path::new(&file_path_str);
    if file_path.exists() {
        fs::remove_file(file_path)
            .expect(format!("{}:{},{}", "删除文件", file_path_str, "失败!").as_str());
    }
    let file = File::create(file_path).unwrap();
    serde_json::to_writer(&file, sheet_vecs).unwrap();
}

///生成行数据json
fn create_row_json_data(
    sheet: &Worksheet,
    index: u32,
    info: &Arc<ExportInfo>,
    head_datas: &Vec<HeadData>,
) -> Map<String, Value> {
    //json数据对象
    let mut json_data = Map::new();

    //标记符，表示该行数据是否为空
    let mut is_nuil = true;

    for head_data in head_datas.iter() {
        //获取数据
        if let Some(data_cell) = sheet.get_cell((head_data.index, index)) {
            let cell_data = data_cell.get_value().to_string();
            if !cell_data.is_empty() {
                //标记不为空数据
                is_nuil = false;

                if head_data.data_type == ExcelDataType::Nuil {
                    continue;
                }
                //数组
                if head_data.data_type.is_arr() {
                    json_data.insert(
                        head_data.title.clone(),
                        get_array_value(info, &head_data.data_type, cell_data),
                    );
                } else {
                    if head_data.data_type == ExcelDataType::JSON {
                        let err_str =
                            format!("{},{} json数据解析失败!", sheet.get_name(), head_data.title);
                        let cell_value: Value = serde_json::from_str(&cell_data).expect(&err_str);
                        json_data.insert(head_data.title.clone(), cell_value);
                    } else if head_data.data_type == ExcelDataType::String {
                        json_data.insert(head_data.title.clone(), Value::String(cell_data));
                    } else if head_data.data_type.is_number() {
                        json_data.insert(head_data.title.clone(), get_number(cell_data));
                    }
                }
            }
        }
    }
    if is_nuil {
        json_data.clear();
    }
    json_data
}

fn get_number(cell_data: String) -> Value {
    if cell_data.is_empty() {
        return Value::Number(Number::from(0));
    }
    //如果包含小数点,说明是浮点数
    if cell_data.contains(".") {
        let v = cell_data.parse::<f64>().unwrap_or(0.0);
        return Value::Number(Number::from_f64(v).unwrap());
    } else {
        //如果包含负号,说明是带符号整数
        if cell_data.contains("-") {
            let v = cell_data.parse::<i64>().unwrap_or(0);
            return Value::Number(Number::from(v));
        } else {
            let v = cell_data.parse::<u64>().unwrap_or(0);
            return Value::Number(Number::from(v));
        }
    }
}

fn get_array_value(info: &Arc<ExportInfo>, data_type: &ExcelDataType, cell_data: String) -> Value {
    let arr: Vec<&str> = cell_data.split(info.separator).collect();
    let mut list: Vec<Value> = Vec::new();
    if data_type.is_number() {
        for data in arr {
            list.push(get_number(data.to_string()));
        }
    } else {
        for data in arr {
            list.push(Value::String(data.to_string()));
        }
    }
    Value::Array(list)
}

/**
 * 获取Sheet的表头数据列表
 */
fn get_head_list(sheet: &Worksheet, info: &Arc<ExportInfo>) -> Vec<HeadData> {
    let mut head_list: Vec<HeadData> = Vec::new();
    // 获取列数
    let column = sheet.get_highest_column();
    for idx in 0..column {
        let mut column_data = HeadData::new();
        column_data.index = idx + 1;
        // 表头
        if let Some(data_cell) = sheet.get_cell((column_data.index, info.title_idx)) {
            column_data.title = data_cell.get_value().to_string();
        }
        //类型
        if let Some(data_cell) = sheet.get_cell((column_data.index, info.type_idx)) {
            column_data.data_type =
                ExcelDataType::from_str(&data_cell.get_value().to_string().to_lowercase()).unwrap();
        }
        //注释
        if let Some(data_cell) = sheet.get_cell((column_data.index, info.comment_idx)) {
            column_data.comment = data_cell.get_value().to_string();
        }
        if column_data.is_valid() {
            head_list.push(column_data);
        }
    }
    // head_list.sort_by(|a, b| a.title.cmp(&b.title));
    head_list
}

fn find_xlsx_files(dir: &Path) -> std::io::Result<Vec<PathBuf>> {
    let mut files = Vec::new();
    // 读取目录中的所有条目
    if let Ok(entries) = fs::read_dir(dir) {
        for entry in entries {
            if let Ok(entry) = entry {
                let path = entry.path();
                if path.is_dir() {
                    // 如果是目录，则递归查找
                    let sub_xlsx_files = find_xlsx_files(&path)?;
                    files.extend(sub_xlsx_files);
                } else if let Some(ext) = path.extension() {
                    if ext == "xlsx" {
                        let file_name = path
                            .file_name()
                            .unwrap()
                            .to_str()
                            .unwrap()
                            .replace(".xlsx", "");
                        //忽略临时文件
                        if !file_name.contains("~$") {
                            files.push(path);
                        }
                    }
                }
            }
        }
    }
    Ok(files)
}

/**
 * 写txt文件
 */
fn write_txt_file(path: &str, data: &str) {
    let path = Path::new(path);
    if path.exists() {
        fs::remove_file(path).expect("删除文件失败");
    }
    let mut file =
        File::create(path).expect(format!("创建文件失败{}", path.to_str().unwrap()).as_str());
    file.write_all(data.as_bytes()).expect("写入文件失败");
}

///获取名称
fn get_file_name(file_name: &str) -> String {
    let arr = file_name.split("-").collect::<Vec<&str>>();
    if arr.len() > 1 {
        return arr[1].to_string();
    }
    file_name.to_string()
}
