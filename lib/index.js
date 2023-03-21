const sqlite3 = require('sqlite3').verbose();

let db;

const open = async (path, mode) => {
    return new Promise((resolve,reject) => {
	if (mode)
	    db = new sqlite3.Database(path, mode, (err) => {
		if (err)
		    return reject(err);
		resolve();
	    });
	else
	    db = new sqlite3.Database(path, (err) => {
		if (err)
		    return reject(err);
		resolve();
	    });
    });
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

const prepare = async (sql) => {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare(sql, (err) => {
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
    close: close,
    OPEN_READONLY: sqlite3.OPEN_READONLY,
    OPEN_READWRITE: sqlite3.OPEN_READWRITE,
    OPEN_CREATE: sqlite3.OPEN_CREATE,
    OPEN_FULLMUTEX: sqlite3.OPEN_FULLMUTEX,
    OPEN_URI: sqlite3.OPEN_URI,
    OPEN_SHAREDCACHE: sqlite3.OPEN_SHAREDCACHE,
    OPEN_PRIVATECACHE: sqlite3.OPEN_PRIVATECACHE
};
