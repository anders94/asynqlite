const sqlite = require('../lib');

(async () => {
    sqlite.open(':memory:');

    const res = await sqlite.run('select datetime() as foo');
    console.log(res[0].foo);

    sqlite.close();

})();
