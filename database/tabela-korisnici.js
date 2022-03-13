const { token } = require('morgan');
const pool = require('./connection');
const tabela='korisnici';

const korisnici={
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
  selectID: async function(id){
    let conn;
    try {
      conn = await pool.getConnection();
      const res = await conn.query("SELECT * from "+tabela+" where id_korisnika=?", [id]);
      //console.log(res); 
      conn.end();
      return res[0];
    } catch (err) {
        conn.end();
      throw err;
    }
  },
  selectUsername: async function(username){
    let conn;
    try {
      conn = await pool.getConnection();
      const res = await conn.query("SELECT * from "+tabela+" where username=?", [username]);
      conn.end();
      return res[0];
    } catch (err) {
        conn.end();
      throw err;
    }
  },
  selectToken: async function(token){
    let conn;
    try {
      conn = await pool.getConnection();
      const res = await conn.query("SELECT COUNT(*) as cnt FROM aktivne_sesije WHERE token=?", [token]);
      conn.end();
      return (res[0].cnt>0);
    } catch (err) {
        conn.end();
      throw err;
    }
  },
  selectIdByToken: async function(token){
    let conn;
    try {
      conn = await pool.getConnection();
      const res = await conn.query("SELECT id_korisnika FROM aktivne_sesije WHERE token=?", [token]);
      conn.end();
      return (res[0].id_korisnika);
    } catch (err) {
        conn.end();
      throw err;
    }
  },
  deleteToken: async function(token){
    let conn;
    try {
      conn = await pool.getConnection();
      const res = await conn.query("DELETE FROM aktivne_sesije WHERE token=?", [token]);
      conn.end();
    //   console.log(res);
      return res.affectedRows>0;
    } catch (err) {
        conn.end();
      throw err;
    }
  },
  insert: async function(username,password){
    let conn;
    try {
      conn = await pool.getConnection();
      let c = await conn.query("SELECT COUNT(*) as cnt from "+tabela+" WHERE username=?", [username]);
      //console.log(c[0].cnt)
      if(c[0].cnt>0){
        conn.end();
        throw new Error('Korisnik sa unetim imenom već postoji');
      }
      const res = await conn.query("INSERT INTO "+tabela+" (username,password) VALUES (?,?)", [username,password]);
      //console.log(res); 
      if(res.affectedRows==0){
        conn.end();
        throw new Error('Nije uspelo upisivanje u bazu');
      }
      conn.end();
      return res;
    } catch (err) {
        conn.end();

      throw err;
    }
  },
  insertToken: async function(id_korisnika,token){
    let conn;
    try {
      conn = await pool.getConnection();
      const res = await conn.query("INSERT INTO aktivne_sesije (id_korisnika,token) VALUES (?,?)", [id_korisnika,token]);
      if(res.affectedRows==0){
        conn.end();
        throw new Error('Nije uspelo upisivanje u bazu');
      }
      conn.end();
      return res;
    } catch (err) {
        conn.end();

      throw err;
    }
  }
}

module.exports=korisnici;