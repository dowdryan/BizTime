const { Client } = require('pg');
let DB_URI;

if (process.env.NODE_ENV === "test") {
    DB_URI = 'postgres:///biztime_test?host=/var/run/postgresql';
} else {
    DB_URI = 'postgres:///biztime?host=/var/run/postgresql';
}

let db = new Client({
    connectionString: DB_URI
})

db.connect();
module.exports = db;