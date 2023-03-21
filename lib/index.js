const sqlite3 = require('sqlite3').verbose();

let db;

const open = (path) => {
    db = new sqlite3.Database(path);
};

const run = async (sql, params) => {
    return new Promise((resolve,reject) => {
        db.all(sql, params, (err, rows) => {
            if (err)
                return reject(err);
            resolve(rows);
        });
    });
};

const prepare = async (sql, params) => {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare(sql, params, (err) => {
            if (err)
                return reject(err);
            resolve(stmt);
        });
    });
};

const finalize = async (stmt) => {
    return new Promise((resolve, reject) => {
        stmt.finalize((err) => {
            if (err)
                return reject(err);
            resolve();
        });
    });
};

const close = async () => {
    return new Promise((resolve, reject) => {
        db.close((err) => {
            if (err)
                return reject(err);
            resolve();
        });
    });
};

module.exports = {
    open: open,
    run: run,
    prepare: prepare,
    finalize: finalize,
    close: close
};
