const sqlite = require("sqlite3");

class Database {
    constructor(){
        this.db = new sqlite.Database("./databases/db.sql");
    }
}