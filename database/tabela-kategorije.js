const { token } = require('morgan');
const pool = require('./connection');
const tabela='kategorije';

const kategorije={
  select: async function() {
    let conn;
    try {
      conn = await pool.getConnection();
      const res = await conn.query("SELECT * from "+tabela);
      conn.end();
      return res;
    } catch (err) {
        conn.end();
      throw err;
    }
  }
}

module.exports=kategorije;