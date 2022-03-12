const korisnici=require('../database/tabela-korisnici');
const bcrypt = require('bcrypt');
var crypto = require("crypto");
var saltRounds = 10;

async function prikazi(req, res) {
  try{
    const s = await korisnici.select();
    res.status(200).json(s);
  }
  catch(err){
    console.error(err);
    res.status(500).json(err);
  }
}

async function prikaziJedan(req, res) {
  try{
    const s = await korisnici.selectID(req.params.id);
    //console.log("S: "+s);
    res.status(200).json(s);
  }
  catch(err){
    console.error(err);
    res.status(500).json(err);
  }
}

async function signUp(req,res){

  try{
    const hash = await bcrypt.hash(req.body.password, saltRounds);
    var token = crypto.randomBytes(50).toString('hex');
    const r = await korisnici.insert(req.body.username, hash, token);
    //console.log(r);
    res.status(200).json({ success: true, message: 'ok'});
  } catch(err){
    //console.error(err);
    if(err.message=='Korisnik sa unetim imenom već postoji')
      res.status(403).json({sucess: false, message:err.message});
    else
      res.status(500).json(err);
  }
}

async function logIn(req,res){

  try{
    const k = await korisnici.selectUsername(req.body.username);
    if(k==undefined)
      return res.status(403).json({success: false, message:'Pogrešno korisničko ime'});
    //console.log(req.body.password, k.password)
    const match = await bcrypt.compare(req.body.password, k.password);
    if(!match)
      return res.status(403).json({success: false, message:'Pogrešna lozinka'});

    res.status(200).json({success: true, token: k.token});
  } catch(err){
    console.error(err);
    if(err.message=='Korisnik sa unetim imenom već postoji')
      res.status(403).json({success: false, message:err.message});
    else
      res.status(500).json({success: false, message:err.message});
  }
}


module.exports = {
  prikazi,
  prikaziJedan,
  signUp,
  logIn
};