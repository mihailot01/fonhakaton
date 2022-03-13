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
      const res = await conn.query("INSERT INTO "+tabela+" (id_akcije, id_korisnika, qr_token) VALUES (?,?,?)", [id_akcije, id_korisnika, token]);
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
  },
  brojKorisnika: async function(id_akcije) {
    let conn;
    try {
      conn = await pool.getConnection();
      const res = await conn.query("SELECT COUNT(*) as cnt from "+tabela+" WHERE id_akcije=?", [id_akcije]);
      conn.end();
      return parseInt(res[0].cnt);
    } catch (err) {
        conn.end();
      throw err;
    }
  },
  verifikuj: async function(qrToken){
    let conn;
    try {
      conn = await pool.getConnection();
      const res = await conn.query("UPDATE "+tabela+" SET verifikovan=1 WHERE qr_token = ?", [qrToken]);
      // console.log(res);
      if(res.affectedRows==0){
        conn.end();
        return false;
      }
      conn.end();
      return true;
    } catch (err) {
      conn.end();
      console.log(err);
      throw err;
    }
  },
  prijavljen: async function(id_akcije, id_korisnika){
    let conn;
    try {
      conn = await pool.getConnection();
      const res = await conn.query("SELECT COUNT(*) as cnt from "+tabela+" WHERE id_akcije = ? AND id_korisnika = ?",[id_akcije,id_korisnika]);
      //console.log(res); 
      conn.end();
      return res[0].cnt>0;
    } catch (err) {
        conn.end();
      throw err;
    }
  },
  selectQrToken: async function(id_akcije, id_korisnika){
    let conn;
    try {
      conn = await pool.getConnection();
      const res = await conn.query("SELECT qr_token from "+tabela+" WHERE id_akcije = ? AND id_korisnika = ?",[id_akcije,id_korisnika]);
      conn.end();
      return res[0].qr_token;
    } catch (err) {
        conn.end();
      throw err;
    }
  },
}

module.exports=akcije_korisnici;