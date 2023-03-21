const db = require('asynqlite');

(async () => {
    db.open(':memory:');

    await db.run('CREATE TABLE foo (bar TEXT)');

    const stmt = await db.prepare('INSERT INTO foo VALUES (?)');
    for (let i = 0; i < 10; i++) {
        stmt.run('test ' + i);
    }
    await db.finalize(stmt);

    const res = await db.run('SELECT rowid AS id, bar FROM foo');
    console.log(res);

    await db.close();
})();
