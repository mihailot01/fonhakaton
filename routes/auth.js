
var express = require('express');
var router = express.Router();
const { 
  signUp,
  logIn,
  checkToken,
  logout,
  brPoena
}=require('../controllers/auth-controller');

/* GET users listing. */
router.post('/register', signUp);
router.post('/login', logIn);
router.post('/check-token', checkToken, (req,res)=>{
        res.status(200).json({ success: true, message: 'ok'});}
    );
router.post('/logout', logout);
router.get('/points', checkToken, brPoena);

module.exports = router;