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
const db = new sqlite3.Database(__dirname + "/../chat2.db");
const closeDatabase = () => {
    db.close();
}
// READ 1, READ ALL 공통
const _createPromise = async (query) => {
    return await new Promise((resolve, reject) => {
        db.all(query, (err, rows) => {
            resolve(rows);
        });
    });
};
const ChattingLog = class {
    constructor() {
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
        const dd = await new Promise((resolve, reject) => {
            db.each(query, (err, row) => {
                resolve(row);
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
    getUserType = async (user_id) => {
        let query = `SELECT type FROM user WHERE user_id=${user_id}`;
        return await _createPromise(query);;
    }
    createUserTable() {
        db.run("CREATE TABLE IF NOT EXISTS user(user_id integer primary key autoincrement, gender varchar(20), nickname varhchar(20),\n\
        user_image text, animal_type varchar(20), type varchar(2))");
    }
    deleteTable = async () => {
        return new Promise((resolve, reject) => {
            db.run("DROP TABLE user",(res, err) => {
                if (!err) {
                    resolve(res)
                } else {
                    reject(err)
                }
            });
        })
    }
    insert(gender, nickname, user_image_path, animal_type, type) {
        const stmt = db.prepare(
            "INSERT into user(gender, nickname, user_image, animal_type, type) values(?,?,?,?,?)"
        );
        stmt.run(gender, nickname, user_image_path, animal_type, type);
        stmt.finalize();
    }
    updateImage(user_id, user_image_path) {
        const stmt = db.prepare(
            "UPDATE user SET user_image=? WHERE user_id=?"
        );
        stmt.run(user_image_path, user_id);
        stmt.finalize();
    }
    updateAnimalType(user_id, animal_type) {
        const stmt = db.prepare(
            "UPDATE user SET animal_type=? WHERE user_id=?"
        );
        stmt.run(animal_type, user_id);
        stmt.finalize();
    }
    updateType(user_id, type) {
        const stmt = db.prepare(
            "UPDATE user SET type=? WHERE user_id=?"
        );
        stmt.run(type, user_id);
        stmt.finalize();
    }
    deleteById = (user_id) => {
        const stmt = db.prepare(
            "DELETE FROM user WHERE user_id=?"
        );
        stmt.run(user_id);
        stmt.finalize();
    }


//     (node:55305) UnhandledPromiseRejectionWarning: Error: SQLITE_ERROR: no such column: taeeun
// --> in Database#all('SELECT * FROM user WHERE nickname=taeeun', [Function (anonymous)])
//     at /Users/josang-yeon/2020/boostcamp/relay_02/chatapp/db/chat.js:164:16
//     at new Promise (<anonymous>)
    findByUserNicknameAsync(nickname) {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM user WHERE nickname='${nickname}'`, (error, rows) => {
                if(error) {
                    reject(error);
                } else {
                    if(rows.length === 0) {
                        resolve({});
                    } else {
                        resolve(rows[rows.length - 1]);
                    }
                }
            });
        });
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
module.exports = { User: User, ChattingLog: ChattingLog, closeDatabase: closeDatabase };