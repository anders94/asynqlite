# asynqlite

Simple async/await wrapper for SQLite. Uses `sqlite3` behind the scenes adding a wrapper
allowing async/await operation. It also greatly simplifies the the API.

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
    console.log(res[0].foo);

    db.close();
})();
```

Use a prepared statement: (you don't need to `await` the statements)

```js
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
```

## API
- `db.open(path, options)`
  - `path` is a local filesystem path and filename for persistant storage, nothing
    for filesystem based non-persistant storage or `:memory:` for a memory based
    non persistant database.
  - `options` are one or more pipe delineated `db.OPEN_READONLY`, `db.OPEN_READWRITE`,
    `db.OPEN_CREATE`, `db.OPEN_FULLMUTEX`, `db.OPEN_URI`, `db.OPEN_SHAREDCACHE`,
    `db.OPEN_PRIVATECACHE`. The default is `OPEN_READWRITE | OPEN_CREATE | OPEN_FULLMUTEX`.
- `db.run(sql (, [param, ...]))` - returns an array of results (if any)
  - `sql` is the SQL statement in text to be executed.
  - The optional array of `param` values will be substituted for `?` in the SQL.
    Example: set `bar` equal to `a` where baz is `b` in thr table `foo`
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
    Example: Prepare an INSERT statement and execute it with three different sets of values:
    ```js
    const stmt = await db.prepare('INSERT INTO foo (a, b) VALUES (?, ?)');
    stmt.run('x', 1);
    stmt.run('y', 2);
    stmt.run('z', 3);
    await db.finalize(stmt);
    ```
    > Note: You don't have to await each statement because the `finalize()` effectivly does this.
- `db.close()`
  - Closes the database handle.
