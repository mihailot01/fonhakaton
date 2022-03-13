
var express = require('express');
var router = express.Router();
const { novaAkcija, prikaziAkcije }=require('../controllers/akcije-controller');
const { checkToken }=require('../controllers/auth-controller');
const { novaAkcijaKorisnik, odustaniOdAkcije }=require('../controllers/akcije_korisnici-controller');


/* GET users listing. */
router.post('/', checkToken, novaAkcija);
router.post('/checkin', checkToken, novaAkcijaKorisnik)
router.post('/cancel', checkToken, odustaniOdAkcije)
router.get('/', checkToken, prikaziAkcije)

module.exports = router;