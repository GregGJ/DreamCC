use cc_module_check::module_check::{self, check};
use clap::Parser;
use clap_derive::{Subcommand};
use module_check::check::ModuleCheckArgs;




#[derive(Parser)]
#[command(version, about, long_about = None)]
#[command(propagate_version = true)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    ///模块检测
    ModuleCheck(ModuleCheckArgs),
}


#[tokio::main]
async fn main()->Result<(),Box<dyn std::error::Error>> {
    let cli=Cli::parse();
    match &cli.command{
        Commands::ModuleCheck(input) => {
            check::module_check(input.clone()).await?;
        }
    }
    Ok(())
}
