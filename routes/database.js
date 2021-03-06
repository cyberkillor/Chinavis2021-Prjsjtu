const Database = require("better-sqlite3");
const path = require("path");

// api: 
// https://github.com/JoshuaWise/better-sqlite3/blob/HEAD/docs/api.md

// 建立数据库连接
let f = path.join(__dirname, "../data/data_test.db.nosync");
const db = new Database(f, {
    verbose: console.log,
    readonly: true
});

function getDB(stmt) {
    return db.prepare(stmt).all();
}

module.exports = getDB;
