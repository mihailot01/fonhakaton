const akcije=require('../database/tabela-akcije');
const korisnici=require('../database/tabela-korisnici');
const akcije_korisnici=require('../database/tabela-akcije_korisnici');

const { isGeneratorFunction } = require('util/types');
var saltRounds = 10;


async function novaAkcija(req,res){

  try{
    id_korisnika = await korisnici.selectIdByToken(req.token); 
    const ok = await akcije.insert(req.body.name, req.body.time, req.body.lat, req.body.lng, req.body.address, req.body.description, req.body.numPeople, id_korisnika, req.body.id_kategorije, req.body.slika);
    if(!ok){
      res.status(403).json({success: false, message:"Nije uspelo čuvanje akcije"});
      return;
    }
    res.status(200).json({ success: true, message: 'ok'});
  } catch(err){
    console.log(err);
      res.status(500).json(err);
  }
}


async function prikaziAkcije(req,res){

  try{
    const a = await akcije.select();
    const k = await korisnici.selectIdByToken(req.token);
    for(var akcija of a)
    {
      akcija.broj_prijavljenih = await akcije_korisnici.brojKorisnika(akcija.id_akcije);
      akcija.prijavljen = await akcije_korisnici.prijavljen(akcija.id_akcije,k)
    }
    res.status(200).json(a);
  } catch(err){
    console.log(err);
      res.status(500).json(err);
  }
}

module.exports = {
  novaAkcija,
  prikaziAkcije
};