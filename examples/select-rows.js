const db = require('asynqlite');

(async () => {
    db.open(':memory:');

    await db.run('CREATE TABLE foo (bar TEXT);');
    await db.run('INSERT INTO foo (bar) VALUES (?), (?), (?);', [1, 2, 3]);

    const res = await db.run('SELECT bar FROM foo;');

    for (let r=0; r<res.length; r++)
        console.log(res[r].bar);

    db.close();
})();
