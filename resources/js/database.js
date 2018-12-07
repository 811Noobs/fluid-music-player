let fs = require('fs');
let SQL = require('sql.js');

class Database {
    constructor() {
        this.cols = ["name", "rank" , "lyc", "path", "singer", "album", "hits"];
        try {
            let filebuffer = fs.readFileSync('hzytql.sqlite');
            this.db = new SQL.Database(filebuffer);
        } catch (e) {
            this.db = new SQL.Database();
            this.init();
            this.save();
        }
    }

    save() {
        let data = this.db.export();
        let buffer = Buffer.from(data);
        fs.writeFileSync("hzytql.sqlite", buffer);
    }

    init() {
        this.db.run("CREATE TABLE list (name CHAR(100),rank INT(5),lyc VARCHAR(500),path VARCHAR(500),singer CHAR(50),album CHAR(50),hits INT(10));");
    }

    buildPar(par) {
        let build_par_str = "", build_par_obj = {};
        if (par === "" || par === undefined) {
            build_par_str = "1=1";
        } else {
            let is_first = 1;
            for (let [k, v] of par) {
                if (is_first) {
                    is_first = 0;
                    build_par_str += `${k}=:val_${k}`;
                } else {
                    build_par_str += ` AND ${k}=:val_${k}`;
                }
                build_par_obj[":val_" + k] = v;
            }
        }
        return [build_par_str, build_par_obj];
    }

    read(par) {
        if (par === undefined) {
            return this.db.exec(`SELECT * FROM list ORDER BY rank DESC;`);
        } else {
            let [build_par_str, build_par_obj] = this.buildPar(par);
            let prepare = this.db.prepare(`SELECT * FROM list WHERE ${build_par_str} ORDER BY rank DESC;`);
            return prepare.getAsObject(build_par_obj);
        }

    }

    insert(v) {
        let build_v = "";
        let isfirst = 1;
        for (let _i = 0; _i < this.cols.length; _i++) {
            if (isfirst) {
                isfirst = 0;
                build_v += v[_i] ? ("\"" + v[_i] + "\"") : "\"\"";
            } else {
                build_v += v[_i] ? (",\"" + v[_i] + "\"") : (",\"\"");
            }
        }
        return this.db.run(`INSERT INTO list VALUES(${build_v});`);
    }

    update(par, k, v) {
        let [build_par_str, build_par_obj] = this.buildPar(par);
        k = "\"" + k + "\"";
        v = "\"" + v + "\"";
        let prepare = this.db.prepare(`UPDATE list SET ${k}=${v} WHERE ${build_par_str};`);
        return prepare.getAsObject(build_par_obj);
    }

    delete(par) {
        let [build_par_str, build_par_obj] = this.buildPar(par);
        let prepare = this.db.prepare(`DELETE FROM list WHERE ${build_par_str};`);
        return prepare.getAsObject(build_par_obj);
    }
}

class SongList extends Database {
    constructor() {
        super();
        super.read();
    }

    getSongList() {
        super.read();
        super.save();
    }

    /**
     * @param arr {array} WHERE
     */
    addSongList(arr) {
        super.insert(arr);
        super.save();
    }

    /**
     * @param par {array} WHERE
     */
    deleteSongList(par) {
        super.delete(par);
        super.save();
    }

    /**
     * @param par {array} WHERE
     * @param k {string}
     * @param v {string}
     */
    updateSongList(par,k,v) {
        super.update(par,k,v);
        super.save();
    }
}

module.exports =  new Database();