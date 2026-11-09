const {Pool} = require("pg");

const DB = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'eventos2a',
    password: 'admin',
    port: 5432
})
module.exports = DB;