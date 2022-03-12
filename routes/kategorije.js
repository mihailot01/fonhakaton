
var express = require('express');
var router = express.Router();
const { 
  prikaziKategorije
}=require('../controllers/kategorije-controller');

const { 
  checkToken,
}=require('../controllers/auth-controller');

/* GET users listing. */
router.get('/', checkToken, prikaziKategorije);

module.exports = router;