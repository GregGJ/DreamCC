use crate::utils::file_utils::{capitalize_first_letter, get_tab_str};

use super::datas::{ExcelDataType, HeadData};

///代码生成器
pub trait CodeGenerater: Send + Sync {
    fn generate_enum_head(&self,tab_num: usize) -> String;
    fn generate_enum(&self, tab_num: usize, file_name: &str, sheet_name: &str) -> String;
    ///生成代码头
    fn generate_head(&self, tab_num: usize, space_name: &str) -> String;
    fn generate_end(&self, tab_num: usize) -> String;
    fn generate(&self, tab_num: usize, sheet_name: &str, head_datas: &Vec<HeadData>) -> String;
}

pub struct TsCodeGenerater {}

impl Clone for TsCodeGenerater {
    fn clone(&self) -> Self {
        TsCodeGenerater {}
    }
}

impl CodeGenerater for TsCodeGenerater {
    fn generate_enum_head(&self, tab_num: usize) -> String {
        let tab_str = get_tab_str(tab_num);
        String::from(format!("{}export enum ConfigKeys {{\n", tab_str))
    }

    fn generate_enum(&self, tab_num: usize, file_name: &str, sheet_name: &str) -> String {
        let tab_str = get_tab_str(tab_num);
        let file = capitalize_first_letter(file_name);
        let sheet = capitalize_first_letter(sheet_name);
        format!(
            "{}{}_{} = \"{}/{}\",\n",
            tab_str,file, sheet, file_name, sheet_name
        )
    }

    fn generate_head(&self, tab_num: usize, space_name: &str) -> String {
        let tab_str = get_tab_str(tab_num);
        let space_name = capitalize_first_letter(space_name);
        format!("{}namespace {} {{\n", tab_str, space_name)
    }

    fn generate_end(&self, tab_num: usize) -> String {
        let tab_str = get_tab_str(tab_num);
        String::from(format!("{}}}\n", tab_str))
    }

    fn generate(&self, tab_num: usize, sheet_name: &str, head_datas: &Vec<HeadData>) -> String {
        let tab_str = get_tab_str(tab_num);
        let tab_str1 = get_tab_str(tab_num + 1);
        let sheet_name = capitalize_first_letter(sheet_name);
        let mut result = format!("{}export interface {} {{\n", tab_str, sheet_name);

        let titles = head_datas
            .iter()
            .map(|i| i.title.clone())
            .collect::<Vec<String>>();

        let types = head_datas
            .iter()
            .map(|i| i.data_type)
            .collect::<Vec<ExcelDataType>>();
        let comments = head_datas
            .iter()
            .map(|i| i.comment.clone())
            .collect::<Vec<String>>();

        for i in 0..titles.len() {
            let mut line: String = String::new();
            let title = titles.get(i).unwrap();
            let data_type = types.get(i).unwrap();
            let mut comment = String::new();
            if let Some(c) = comments.get(i) {
                comment.push_str(c);
            } else {
                comment.push_str(title);
            }
            if !comment.is_empty() {
                line.push_str(&format!("{}/** {} */\n", tab_str1, comment));
            }
            if data_type.is_arr() {
                if data_type.is_number() {
                    line.push_str(&format!("{}{}: Array<number>;\n", tab_str1, title));
                } else {
                    line.push_str(&format!("{}{}: Array<string>;\n", tab_str1, title));
                }
            } else {
                if data_type.is_number() {
                    line.push_str(&format!("{}{}: number;\n", tab_str1, title));
                } else if data_type.is_json() {
                    line.push_str(&format!("{}{}: any;\n", tab_str1, title));
                } else {
                    line.push_str(&format!("{}{}: string;\n", tab_str1, title));
                }
            }
            if line.is_empty() {
                continue;
            }
            result.push_str(&line);
        }
        result.push_str(&format!("{}}}\n", tab_str));
        result
    }
}
