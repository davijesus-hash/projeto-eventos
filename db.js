const {Pool} = require("pg");

const BD = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'eventos2a',
    password: 'admin',
    port: 5432
})
module.exports = BD;