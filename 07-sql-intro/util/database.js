const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'node-course',
  password: '12345',
});

module.exports = pool.promise();
