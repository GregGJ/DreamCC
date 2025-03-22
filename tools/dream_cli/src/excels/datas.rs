use super::utils::TYPES_ARR;

#[derive(Debug, PartialEq, Clone, Copy)]
pub enum ExcelDataType {
    Nuil = 0,
    Byte,
    UByte,
    Short,
    UShort,
    Int,
    UInt,
    Float,
    Number,
    String,
    JSON,
    ArrByte,
    ArrUByte,
    ArrShort,
    ArrUShort,
    ArrInt,
    ArrUInt,
    ArrFloat,
    ArrNumber,
    ArrString,
}

impl ExcelDataType {
    fn as_str(&self) -> &'static str {
        match self {
            ExcelDataType::Byte => "byte",
            ExcelDataType::UByte => "ubyte",
            ExcelDataType::Short => "short",
            ExcelDataType::UShort => "ushort",
            ExcelDataType::Int => "int",
            ExcelDataType::UInt => "uint",
            ExcelDataType::Float => "float",
            ExcelDataType::Number => "number",
            ExcelDataType::String => "string",
            ExcelDataType::JSON => "json",
            ExcelDataType::ArrByte => "[byte]",
            ExcelDataType::ArrUByte => "[ubyte]",
            ExcelDataType::ArrShort => "[short]",
            ExcelDataType::ArrUShort => "[ushort]",
            ExcelDataType::ArrInt => "[int]",
            ExcelDataType::ArrUInt => "[uint]",
            ExcelDataType::ArrFloat => "[float]",
            ExcelDataType::ArrNumber => "[number]",
            ExcelDataType::ArrString => "[string]",
            _ => "",
        }
    }

    ///是否是数组
    pub fn is_arr(&self) -> bool {
        match self {
            ExcelDataType::ArrByte
            | ExcelDataType::ArrUByte
            | ExcelDataType::ArrShort
            | ExcelDataType::ArrUShort
            | ExcelDataType::ArrInt
            | ExcelDataType::ArrUInt
            | ExcelDataType::ArrFloat
            | ExcelDataType::ArrNumber
            | ExcelDataType::ArrString => true,
            _ => false,
        }
    }

    ///是否是数字
    pub fn is_number(&self) -> bool {
        match self {
            ExcelDataType::String | ExcelDataType::ArrString | ExcelDataType::JSON => false,
            _ => true,
        }
    }

    pub fn is_json(&self)->bool{
        match self {
            ExcelDataType::JSON => true,
            _ => false,
        }
    }

    pub fn from_str(value: &str) -> Option<ExcelDataType> {
        match value {
            "byte" => Some(ExcelDataType::Byte),
            "ubyte" => Some(ExcelDataType::UByte),
            "short" => Some(ExcelDataType::Short),
            "ushort" => Some(ExcelDataType::UShort),
            "int" => Some(ExcelDataType::Int),
            "uint" => Some(ExcelDataType::UInt),
            "float" => Some(ExcelDataType::Float),
            "number" => Some(ExcelDataType::Number),
            "string" => Some(ExcelDataType::String),
            "json" => Some(ExcelDataType::JSON),
            "[byte]" => Some(ExcelDataType::ArrByte),
            "[ubyte]" => Some(ExcelDataType::ArrUByte),
            "[short]" => Some(ExcelDataType::ArrShort),
            "[ushort]" => Some(ExcelDataType::ArrUShort),
            "[int]" => Some(ExcelDataType::ArrInt),
            "[uint]" => Some(ExcelDataType::ArrUInt),
            "[float]" => Some(ExcelDataType::ArrFloat),
            "[number]" => Some(ExcelDataType::ArrNumber),
            "[string]" => Some(ExcelDataType::ArrString),
            _ => Some(ExcelDataType::Nuil),
        }
    }
}

#[derive(Debug)]
pub struct HeadData {
    pub index: u32,
    pub title: String,
    pub comment: String,
    pub data_type: ExcelDataType,
}

impl HeadData {
    pub fn new() -> HeadData {
        HeadData {
            index: 0,
            title: String::new(),
            comment: String::new(),
            data_type: ExcelDataType::String,
        }
    }

    ///当前列是否有效
    pub fn is_valid(&self) -> bool {
        if self.title.is_empty() || self.data_type.as_str().is_empty() {
            return false;
        }
        true
    }

    ///当前列是否为数组
    pub fn is_arr(&self) -> bool {
        for &type_ in &TYPES_ARR {
            if type_ == self.data_type.as_str() {
                return true;
            }
        }
        false
    }
}
