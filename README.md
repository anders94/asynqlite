# asynqlite

Simple Node.js async/await wrapper for SQLite. Uses `sqlite3` behind the scenes and
greatly simplifies the the API.

## Install

```bash
npm install asynqlite
```

## Examples
`SELECT` some data:

```js
const db = require('asynqlite');

(async () => {
    await db.open(':memory:');

    const res = await db.run('SELECT datetime() AS foo');
    console.log(res[0].foo);    // outputs today's date

    db.close();
})();
```

Pass parameters:

```js
const db = require('asynqlite');

(async () => {
    await db.open(':memory:');

    const res = await db.run('SELECT ? + ? as onePlusTwo', [1, 2]);
    console.log(res[0].onePlusTwo);

    // output:
    // 3

    db.close();
})();
```

Use a prepared statement:

```js
const db = require('asynqlite');

(async () => {
    db.open(':memory:');

    await db.run('CREATE TABLE foo (bar TEXT)');

    const stmt = await db.prepare('INSERT INTO foo VALUES (?)');
    for (let i = 0; i < 5; i++) {
        stmt.run('test ' + i);
    }
    await db.finalize(stmt);

    const res = await db.run('SELECT rowid AS id, bar FROM foo');
    console.log(res);

    // output:
    // [
    //   { id: 1, bar: 'test 0' },
    //   { id: 2, bar: 'test 1' },
    //   { id: 3, bar: 'test 2' },
    //   { id: 4, bar: 'test 3' },
    //   { id: 5, bar: 'test 4' }
    // ]

    await db.close();
})();
```

## API
- `db.open(path, options)`
  - `path` is a local path and filename for persistant storage, `:memory:` for a memory
    based non persistant database or `undefined` for a filesystem based non-persistant
    storage.
  - `options` are one or more pipe delineated `db.OPEN_READONLY`, `db.OPEN_READWRITE`,
    `db.OPEN_CREATE`, `db.OPEN_FULLMUTEX`, `db.OPEN_URI`, `db.OPEN_SHAREDCACHE`,
    `db.OPEN_PRIVATECACHE`. The default is `OPEN_READWRITE | OPEN_CREATE | OPEN_FULLMUTEX`.
- `db.run(sql (, [param, ...]))` - returns an array of results (if any)
  - `sql` is the SQL statement in text to be executed.
  - Optional array of `param` values which will be substituted for `?` in the SQL.
    Example: set `bar` equal to `a` where baz is `b` in the table `foo`
    ```js
    await db.run('UPDATE foo SET bar = ? WHERE baz = ?', [ 'a', 'b' ]);
    ```
  - Returns an array of results. (if any)
    Example: `SELECT` all the rows from the table `foo`:
    ```js
    const res = await db.run('SELECT * FROM foo');
    console.log(res);
    ```
- `db.prepare(sql)` - returns a statement object
  - `sql` is the SQL statement in text to be executed. Parameter substitution (values of which
    are to be supplied later by using the returned statement object) are designated with `?`
    in the SQL statement.
    Example: Prepare an `INSERT` statement and execute it with three different sets of values:
    ```js
    const stmt = await db.prepare('INSERT INTO foo (a, b) VALUES (?, ?)');
    stmt.run('x', 1);
    stmt.run('y', 2);
    stmt.run('z', 3);
    await db.finalize(stmt);
    ```
    > Note: You don't have to `await` each `stmt.run()` because the `await finalize()` effectivly does this.
- `db.finalize(stmt)` - finalizes the passed statement
  - See `db.prepare(sql)` above for example usage.
- `db.close()`
  - Closes the database handle. (happens automatically if you don't do it explicitly)

## More Info

See the [examples](examples/) directory for more.

## License

MIT
