
var express = require('express');
var router = express.Router();
const { 
  novaAkcija
}=require('../controllers/akcije-controller');
const { 
  checkToken,
}=require('../controllers/auth-controller');

/* GET users listing. */
router.post('/', checkToken, novaAkcija);

module.exports = router;