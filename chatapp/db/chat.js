const getDate = () => {
    Number.prototype.pad = function (num) {
        return this.toString().padStart(num, '0');
    }
    const date = new Date();
    const yyyy = date.getFullYear();
    const MM = (date.getMonth() + 1).pad(2);
    const dd = date.getDate().pad(2);
    const hh = date.getHours().pad(2);
    const mm = date.getMinutes().pad(2);
    const ss = date.getSeconds().pad(2);
    return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
}

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('chat.db');

const closeDatabase = () => {
    db.close();
}

// READ 1, READ ALL 공통
const _createPromise = async (query) => {
    return await new Promise ((resolve, reject) => {
        db.all(query, (err, rows) => {
            resolve (rows);
        });
    });
};

const ChattingLog = class {
    constructor () {
        this.createLogTable();
    }
    createLogTable = () => {
        const query = "CREATE TABLE IF NOT EXISTS log (log_id integer primary key autoincrement, user_id integer, timestamp TEXT, message TEXT)";
        db.serialize(() => {
            db.run(query);
        })
    }
    // CREATE
    insert = (user_id, message) => {
        const query = "INSERT into log (user_id, timestamp, message) values(?,?,?)";
        const stmt = db.prepare(query);
        const date = getDate();
        stmt.run(user_id, date, message);
        stmt.finalize();
    }
    

    // READ 1명의 전체 로그
    findByUserId = async (user_id) => {
        const query = `SELECT * FROM log WHERE user_id = '${user_id}'`;
        return await _createPromise(query);
    };

    // READ ALL
    findAll = async () => {
        const query = `SELECT * FROM log`
        return await _createPromise(query);
    };

    // READ 1명의 전체 로그 배열 형식
    getLogs = async () => {
        const query = `SELECT * FROM log WHERE user_id = '${user_id}'`
        const result = [];
        const dd = await new Promise ((resolve, reject) => {
            db.each(query, (err, row) => {
                resolve (row);
                console.log(row);
                // result.push([row.user_id, row.message]);
            });
        });
        return result;
    }

    // UPDATE
    update = (log_id, user_id, message) => {
        const query = "UPDATE log SET user_id=?, message=?, timestamp=? WHERE log_id=?";
        const stmt = db.prepare(query);
        const date = getDate();
        stmt.run(user_id, message, date, log_id);
        stmt.finalize();
    }


    // DELETE
    deleteById = (log_id) => {
        const query = "DELETE FROM log WHERE log_id=?";
        const stmt = db.prepare(query);
        stmt.run(log_id);
        stmt.finalize();
    }
}






// const main = async () => {
//     // SELECT 성공
//     const logtable = await findAll();
//     // const logByUser = await findByUserId(18);
//     console.log(logtable);
//     // console.log(logByUser);

//     // DELETE 성공
//     // deleteById(11);
//     // console.log(await findByUserId('seokjung'));

//     // UPDATE 성공
//     // update(12, 35, 'update msg');
//     // const rows = await findByUserId(35);
//     // console.log(rows);

//     // INSERT 성공
//     // insert(18, 'hi new message');
//     // const rows = await findAll();
//     // console.log(rows);
// }

// main();

const User = class {
    constructor() {
        this.createUserTable();
    }
    createUserTable() {
        db.run("CREATE TABLE IF NOT EXISTS user(user_id integer primary key autoincrement, gender TEXT, nickname TEXT)");
    }
    insert(gender, nickname) {
        const stmt = db.prepare(
          "INSERT into user(gender, nickname) values(?,?)"
        );
        stmt.run(gender, nickname);
        stmt.finalize();
    }
    update(user_id, gender, nickname) {
        const stmt = db.prepare(
            "UPDATE user SET gender=?, nickname=? WHERE user_id=?"
        );
        stmt.run(gender, nickname, user_id);
        stmt.finalize();
    }
    deleteById = (user_id) => {
        const stmt = db.prepare(
            "DELETE FROM user WHERE user_id=?"
        );
        stmt.run(user_id);
        stmt.finalize();
    }
    // READ 1
    findByUserId = async (user_id) => {
        let query = `SELECT * FROM user WHERE user_id=${user_id}`;
        return await _createPromise(query);;
    }

    // READ ALL
    findAll = async () => {
        const query = `SELECT * FROM user`
        return await _createPromise(query);
    };
}

module.exports = { User:User, ChattingLog:ChattingLog, closeDatabase:closeDatabase };