
var express = require('express');
var router = express.Router();
const { 
  signUp,
  logIn
}=require('../controllers/auth-controller');

/* GET users listing. */
router.post('/register', signUp);
router.post('/login', logIn);

module.exports = router;