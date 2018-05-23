var express = require('express');
var router = express.Router();
var Parseador = require('../models/iso');
var Canal = require('../models/canal');
var Cuenta = require('../models/cuenta');
var bodyParser = require('body-parser');
var net = require('net');

/* GET home page. */
router.get('/', function(req, res, next) {
  Cuenta.find({}, function(err, cuenta) {
    if (cuenta[0]) {
      res.render('cuenta/index',{cuenta:cuenta});
    }
    else{
      var cuentas = new Cuenta({
        TarjetaAsociada:"XXXXXXXXXXXXXXXXXX",
        nroBanco:"XXX",
        CajaAhorroPesos:"Caja Ahorro en pesos",
        CajaAhorroDolares:"Caja Ahorro en Dolares",
        CuentaCorrientePesos:"Cuenta Corrientes en pesos",
        CuentaCorrienteDolares:"Cuenta Corrientes en dolares"
      });
      cuentas.save(function(err){
        if(err){console.log(err)};
        res.redirect('/cuenta');
      });
    };
  });
});
router.post('/', function(req, res, next) {
  Cuenta.findOne({}, function(err, cuentas){
    cuentas.TarjetaAsociada = req.body.tarjeta;
    cuentas.nroBanco = req.body.nroBanco;
    cuentas.CajaAhorroPesos = req.body.capesos;
    cuentas.CajaAhorroDolares = req.body.cadolares;
    cuentas.CuentaCorrientePesos = req.body.ccpesos;
    cuentas.CuentaCorrienteDolares = req.body.ccdolares;

    cuentas.save(function(err) {
      if (err) {
        console.log(err);
      };
    });
  })
  res.redirect('/cuenta');
});
module.exports = router;
