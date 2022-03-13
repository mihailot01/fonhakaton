const korisnici=require('../database/tabela-korisnici');
const bcrypt = require('bcrypt');
var crypto = require("crypto");
const { isGeneratorFunction } = require('util/types');
var saltRounds = 10;


async function checkToken(req,res,next){
  try{
    console.log(req.headers.authorization);
    const t=(req.headers.authorization.split(" "))[1];
    console.log(t);
    var ok = await korisnici.selectToken(t);
    if(!ok){
      res.status(403).json({success: false, message:"Neispravan token"});
      return;
    }
    req.token = t;
    next();
  }catch(err){
    console.error(err);
    res.status(403).json({success: false, message:"Neispravan token"});
  }
}

async function logout(req,res){
  try{
    console.log(req.headers.authorization);
    const t=(req.headers.authorization.split(" "))[1];
    console.log(t);
    var ok = await korisnici.deleteToken(t);
    if(!ok){
      res.status(403).json({success: false, message:"Neispravan token"});
      return;
    }
    res.status(200).json({success: true, message:"Uspesno ste se izlogovali"})
  }catch(err){
    console.error(err);
    res.status(403).json({success: false, message:"Neispravan token"});
  }
}

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
    req.body.username = req.body.email;
    const k = await korisnici.selectUsername(req.body.username);
    if(k==undefined)
      return res.status(403).json({success: false, message:'Pogrešno korisničko ime'});
    //console.log(req.body.password, k.password)
    const match = await bcrypt.compare(req.body.password, k.password);
    if(!match)
      return res.status(403).json({success: false, message:'Pogrešna lozinka'});
    var token = crypto.randomBytes(50).toString('hex');
    const k2 = korisnici.insertToken(k.id_korisnika,token)
    res.status(200).json({success: true, token: token});
  } catch(err){
    console.error(err);
    if(err.message=='Korisnik sa unetim imenom već postoji')
      res.status(403).json({success: false, message:err.message});
    else
      res.status(500).json({success: false, message:err.message});
  }
}

async function brPoena(req,res){
  try{
    var id = await korisnici.selectIdByToken(req.token);
    var k = await korisnici.selectID(id);
    console.log(k);
    res.status(200).json({ poeni: k.poeni})
  }catch(err){
    console.error(err);
    res.status(403).json({success: false, message:"Neispravan token"});
  }
}


module.exports = {
  prikazi,
  prikaziJedan,
  signUp,
  logIn,
  checkToken,
  logout,
  brPoena
};