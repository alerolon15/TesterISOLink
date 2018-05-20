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
    if (canal) {
      res.render('canal/index',{canal:canal});
    }
    else{
      res.render('canal/index');
    }
  });
});
router.post('/', function(req, res, next) {

  Canal.findOne({}, function(err, canales){
    if(!canales) { var canales = new Canal();}
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
