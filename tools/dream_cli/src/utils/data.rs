use serde::{Deserialize, Serialize};



#[derive(Serialize, Deserialize, Debug)]
pub struct HttpServerInfo {
    pub name: String,
    pub ftpkey: String,
    pub ftpurl: String,
}