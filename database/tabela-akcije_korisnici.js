const { token } = require('morgan');
const pool = require('./connection');
const tabela='akcije_korisnici';

const akcije_korisnici={
  select: async function() {
    let conn;
    try {
      conn = await pool.getConnection();
      const res = await conn.query("SELECT * from "+tabela);
      //console.log(res); 
      conn.end();
      return res;
    } catch (err) {
        conn.end();
      throw err;
    }
  },
  insert: async function(id_akcije, id_korisnika, token){
    let conn;
    try {
      conn = await pool.getConnection();
      const res = await conn.query("INSERT INTO "+tabela+" (id_akcije, id_korisnika, token) VALUES (?,?,?)", [id_akcije, id_korisnika, token]);
      if(res.affectedRows==0){
        conn.end();
        return false;
      }
      conn.end();
      return true;
    } catch (err) {
      conn.end();
      throw err;
    }
  },
  delete: async function(id_akcije, id_korisnika){
    let conn;
    try {
      conn = await pool.getConnection();
      const res = await conn.query("DELETE FROM "+tabela+" WHERE id_akcije = ? AND id_korisnika = ?", [id_akcije, id_korisnika]);
      if(res.affectedRows==0){
        conn.end();
        return false;
      }
      conn.end();
      return true;
    } catch (err) {
      conn.end();
      throw err;
    }
  }
}

module.exports=akcije_korisnici;