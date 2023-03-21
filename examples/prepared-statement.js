const sqlite = require('../lib');

(async () => {
    sqlite.open(':memory:');

    await sqlite.run('CREATE TABLE foo (bar TEXT)');

    const stmt = await sqlite.prepare('INSERT INTO foo VALUES (?)');
    for (let i = 0; i < 10; i++) {
        stmt.run('test ' + i);
    }
    await sqlite.finalize(stmt);

    const res = await sqlite.run('SELECT rowid AS id, bar FROM foo');
    console.log(res);

    await sqlite.close();

})();
