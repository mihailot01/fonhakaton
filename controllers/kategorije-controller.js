const kategorije=require('../database/tabela-kategorije');

const { isGeneratorFunction } = require('util/types');
var saltRounds = 10;


async function prikaziKategorije(req,res){

  try{
    const r = await kategorije.select();
    res.status(200).json(r);
  } catch(err){
    console.log(err);
      res.status(500).json(err);
  }
}



module.exports = {
  prikaziKategorije
};