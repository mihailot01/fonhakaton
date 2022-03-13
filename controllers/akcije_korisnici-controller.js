const korisnici=require('../database/tabela-korisnici');
const akcije_korisnici=require('../database/tabela-akcije_korisnici');
var crypto = require("crypto");

async function novaAkcijaKorisnik(req,res){

  try{
    id_korisnika = await korisnici.selectIdByToken(req.token); 
    var token = crypto.randomBytes(50).toString('hex');
    const ok = await akcije_korisnici.insert(req.body.actionId, id_korisnika,token);
    if(!ok){
      res.status(403).json({success: false, message:"Nije uspelo uparivanje korisnika sa akcijom"});
      return;
    }
    res.status(200).json({ success: true, message: 'ok'});
  } catch(err){
    console.log(err);
      res.status(500).json(err);
  }
}

async function odustaniOdAkcije(req,res){
  try{
    id_korisnika = await korisnici.selectIdByToken(req.token); 
    const ok = await akcije_korisnici.delete(req.body.actionId, id_korisnika);
    if(!ok){
      res.status(403).json({success: false, message:"Nije uspelo uparivanje odustajanje od akcije"});
      return;
    }
    res.status(200).json({ success: true, message: 'ok'});
  } catch(err){
    console.log(err);
      res.status(500).json(err);
  }
}

async function verifikujPrisustvo(req,res){
  try{
    id_korisnika = await korisnici.selectIdByToken(req.token); 
    const ok = await akcije_korisnici.verifikuj(req.body.qrToken);
    if(!ok){
      res.status(403).json({success: false, message:"Nije uspelo verifikovanje"});
      return;
    }
    res.status(200).json({ success: true, message: 'ok'});
  } catch(err){
    console.log(err);
      res.status(500).json(err);
  }
}

async function prikaziQrToken(req,res){
  try{
    k = await korisnici.selectIdByToken(req.token); 
    token = await akcije_korisnici.selectQrToken(req.body.actionId,k);
    res.status(200).json({ "qr_token": token});
  } catch(err){
    console.log(err);
      res.status(500).json(err);
  }
}

module.exports = {
  novaAkcijaKorisnik,
  odustaniOdAkcije,
  verifikujPrisustvo,
  prikaziQrToken
};