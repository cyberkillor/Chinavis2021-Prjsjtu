const Database = require("better-sqlite3");

// api: 
// https://github.com/JoshuaWise/better-sqlite3/blob/HEAD/docs/api.md

// 建立数据库连接
const db = new Database("data/data.db", { verbose: console.log });

// 返回所有结果
var row = db.prepare("SELECT * FROM cities WHERE province = ?").all("上海市");
console.log(row);

// 这一条和上一条的效果是一样的，如果要传参建议用上一条的写法
var row = db.prepare("SELECT * FROM cities WHERE province = '上海市'").all();
console.log(row);

// 仅返回一条结果
var row = db.prepare("SELECT * FROM cities WHERE province = ?").get("上海市");
console.log(row);

// 关闭数据库连接
db.close();