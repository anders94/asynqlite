const db = require('asynqlite');

(async () => {
    await db.open(':memory:');

    const res = await db.run('SELECT datetime() AS foo');
    console.log(res[0].foo);

    await db.close();
})();
