use std::{f64, u64};

use umya_spreadsheet::Worksheet;

pub const TYPES: [&'static str; 9] = [
    "byte", "ubyte", "short", "ushort", "int", "uint", "float", "number", "string",
];

pub const TYPES_ARR: [&'static str; 9] = [
    "[byte]", "[ubyte]", "[short]", "[ushort]", "[int]", "[uint]", "[float]", "[number]",
    "[string]",
];

pub const BYTE_MIN: i64 = -128;
pub const BYTE_MAX: i64 = 127;

pub const U_BYTE_MIN: u64 = 0;
pub const U_BYTE_MAX: u64 = 255;

pub const SHORT_MIN: i64 = -32768;
pub const SHORT_MAX: i64 = 32767;

pub const U_SHORT_MIN: u64 = 0;
pub const U_SHORT_MAX: u64 = 65535;

pub const INT_MIN: i64 = -9007199254740991;
pub const INT_MAX: i64 = 9007199254740991;

pub const UINT_MIN: u64 = 0;
pub const UINT_MAX: u64 = 9007199254740991;

pub const FLOAT_MIN: f64 = -3.4028235e+38;
pub const FLOAT_MAX: f64 = 3.4028235e+38;

/**
 * 检测值是否在区间内
 */
pub fn in_section<T: Ord>(value: T, min: T, max: T) -> bool {
    value >= min && value <= max
}

/**
 * 检测类型是否是数组类型
 */
pub fn is_array(value: &str) -> bool {
    for &type_ in &TYPES_ARR {
        if type_ == value {
            return true;
        }
    }
    false
}

/**
 * 检测是否是浮点类型
 */
pub fn is_float(values: &Vec<String>) -> bool {
    for value in values {
        if value.contains(".") {
            return true;
        }
    }
    false
}

/**
 * 检测是否是正整数
 */
pub fn is_uint(values: &Vec<String>) -> bool {
    for value in values {
        if value.contains("-") {
            return false;
        }
    }
    true
}



/**
 * 检测当前行是否为空
 */
pub fn is_empty_row(sheet: &Worksheet, row: &u32) -> bool {
    let cells = sheet.get_collection_by_row(row);
    for i in cells {
        let cell_value = i.get_value();
        if !cell_value.is_empty() {
            return false;
        }
    }
    true
}
