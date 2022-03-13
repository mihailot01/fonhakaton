const { token } = require('morgan');
const pool = require('./connection');
const tabela='akcije';

const akcije={
  select: async function() {
    let conn;
    try {
      conn = await pool.getConnection();
      const res = await conn.query("SELECT akcije.*, naziv_kategorije, username as autor from "+tabela+" JOIN korisnici USING(id_korisnika) JOIN kategorije USING(id_kategorije) WHERE DATEDIFF(NOW(),vreme)<=0");
      //console.log(res); 
      conn.end();
      return res;
    } catch (err) {
        conn.end();
      throw err;
    }
  },
  insert: async function(naziv, vreme, latitude, longitude, adresa, opis, brojLjudi, id_korisnika, id_kategorije,slika){
    let conn;
    try {
      conn = await pool.getConnection();
      const res = await conn.query("INSERT INTO "+tabela+" (naziv, vreme, latitude, longitude, adresa, opis, broj_ljudi, id_korisnika, id_kategorije, slika) VALUES (?,?,?,?,?,?,?,?,?,?)", [naziv, new Date(vreme), latitude, longitude, adresa, opis, brojLjudi, id_korisnika, id_kategorije, slika]);
      if(res.affectedRows==0){
        conn.end();
        return false;
      }
      conn.end();
      return true;
    } catch (err) {

      console.log(err);
      conn.end();
      throw err;
    }
  }
}

module.exports=akcije;