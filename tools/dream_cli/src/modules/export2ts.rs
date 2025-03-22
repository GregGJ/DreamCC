use crate::utils::file_utils::get_file_name_str;

#[derive(Debug)]
pub struct Export2Ts {
    pub input: String,
    pub input_file_name: String,
    pub output: String,
    pub output_file_name: String,
    pub packages: Vec<String>,
    pub namespace: String,
    pub debug: bool,
}

impl Export2Ts {
    pub fn new(
        input: &str,
        output: &str,
        packages: Vec<String>,
        namespace: &str,
        debug: bool,
    ) -> Self {
        Export2Ts {
            input: input.to_string(),
            input_file_name: get_file_name_str(input),
            output: output.to_string(),
            output_file_name: get_file_name_str(output),
            packages,
            namespace: namespace.to_string(),
            debug,
        }
    }
}
