var express = require('express');
var router = express.Router();
var Parseador = require('../models/iso');
var Canal = require('../models/canal');
var Cuenta = require('../models/cuenta');
var bodyParser = require('body-parser');
var net = require('net');

/* GET home page. */
router.get('/', function(req, res, next) {
  Canal.find({}, function(err, canal) {
    if (canal[0]) {
      res.render('canal/index',{canal:canal});
    }else{
      var canales = new Canal({
        ip:"127.0.0.1",
        puerto:"13002",
        tipoCanal:"Link"
      });
      canales.save(function(err){
        if(err){console.log(err)};
        res.redirect('/canal');
      });
    };
  });
});

router.post('/', function(req, res, next) {

  Canal.findOne({}, function(err, canales){
    canales.ip = req.body.ip;
    canales.puerto = req.body.puerto;
    canales.tipoCanal = "LINK";

    canales.save(function(err) {
      if (err) {
        console.log(err);
      };
    });
  })
  res.redirect('/canal');
});
module.exports = router;
