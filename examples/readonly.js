const db = require('../lib');

(async () => {
    await db.open(':memory:', db.OPEN_READONLY | db.OPEN_FULLMUTEX);

    const res = await db.run('SELECT datetime() AS foo');
    console.log(res[0].foo);

    await db.close();
})();
