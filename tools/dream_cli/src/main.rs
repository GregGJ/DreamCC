use clap::Parser;
use clap_derive::Subcommand;
use dream_cli::{excels, modules};



#[derive(Parser)]
#[command(version, about, long_about = None)]
#[command(propagate_version = true)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    ///模块中间代码导出
    ModuleExport(modules::module_export::ModuleExportArgs),
    //配置表导出
    ExcelToJson(excels::excel2json::ExcelToJsonArgs),
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    
    let cli=Cli::parse();
    match &cli.command{
        Commands::ExcelToJson(input) => {
            excels::excel2json::excel2json(input.clone()).await?;
        }
        Commands::ModuleExport(input)=>{
            modules::module_export::module_export(input.clone()).await?;
        }
    }
    Ok(())
}