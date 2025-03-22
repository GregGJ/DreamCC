///是否是ts内置类型
pub fn is_ts_keyword_type(var_type: &str) -> bool {
    match var_type {
        "any" | "unknown" | "number" | "Object" | "boolean" | "BigInt" | "string" | "symbol"
        | "void" | "undefined" | "never" | "intrinsic" | "null" | "Error" | "Array" | "Map" => {
            return true;
        }
        _ => {
            return false;
        }
    }
}
