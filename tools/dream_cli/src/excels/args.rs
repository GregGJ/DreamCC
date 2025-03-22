
use clap::Args;

#[derive(Args, Debug, Clone)]
pub struct ExcelFileToJsonArgs {
    #[arg(short, long, help = "输入文件列表(逗号分隔)")]
    input: Option<String>,
    #[arg(short, long, help = "输出文件夹")]
    output: Option<String>,
    #[arg(short, long, default_value = "1", help = "标题行索引")]
    v_title_idx: Option<u32>,
    #[arg(short, long, default_value = "2", help = "类型行索引")]
    w_type_idx: Option<u32>,
    #[arg(short, long, default_value = "3", help = "注释行索引")]
    x_comment_idx: Option<u32>,
    #[arg(short, long, default_value = "5", help = "数据行索引")]
    y_data_idx: Option<u32>,
    #[arg(short, long, help = "分隔符", default_value = "|")]
    z_separator: Option<char>,
}