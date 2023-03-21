asynqlite
=========

A node.js wrapper for SQLite3.

Install
-------

```bash
npm install asynqlite
```

Example
-------

```js
const sqlite = require('asynqlite');

(async () => {
    sqlite.open(':memory:');

    const res = await sqlite.run('select datetime() as foo');
    console.log(res[0].foo);

    sqlite.close();

})();
```
