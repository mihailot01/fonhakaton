const { token } = require('morgan');
const pool = require('./connection');
const tabela='akcije';

const akcije={
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
  insert: async function(naziv, vreme, latitude, longitude, opis, brojLjudi, id_korisnika, id_kategorije){
    let conn;
    try {
      conn = await pool.getConnection();
      const res = await conn.query("INSERT INTO "+tabela+" (naziv, vreme, latitude, longitude, opis, broj_ljudi, id_korisnika, id_kategorije) VALUES (?,?,?,?,?,?,?,?)", [naziv, vreme, latitude, longitude, opis, brojLjudi, id_korisnika, id_kategorije]);
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

module.exports=akcije;