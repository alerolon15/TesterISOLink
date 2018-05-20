var express = require('express');
var router = express.Router();
var Parseador = require('../models/iso');
var Prueba = require('../models/transacciones')
var Canal = require('../models/canal');
var Cuenta = require('../models/cuenta');
var net = require('net');


/* GET home page. */
router.get('/', function(req, res, next) {
    Prueba.find({activar:true}, function(err,pruebas){
      if (err) {
        res.render('index', {error: '<div class="card-panel red darken-2" style="color: rgba(255, 255, 255, 0.9);"><span>Algo fallo en la base de datos</span><i class="material-icons right" onclick="Cerrar()">close</i></div>'});
      }else{
        res.render('index', {pruebas:pruebas});
      }
    });
});


module.exports = router;
