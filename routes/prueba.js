var express = require('express');
var router = express.Router();
var Parseador = require('../models/iso');
var Canal = require('../models/canal');
var Cuenta = require('../models/cuenta');
var Prueba = require('../models/transacciones');
var bodyParser = require('body-parser');
var net = require('net');

/* GET home page. */
router.get('/', function(req, res, next) {
    Prueba.find({}, function(err,pruebas){
      if (err) {
        res.render('prueba/index', {error: '<div class="card-panel red darken-2" style="color: rgba(255, 255, 255, 0.9);"><span>Algo fallo en la base de datos</span><i class="material-icons right" onclick="Cerrar()">close</i></div>'});
      }else{
        res.render('prueba/index', {pruebas:pruebas});
      }
    });
});

router.post('/Activar', function(req, res, next) {
  var id = req.body.ID;
  var activar = req.body.Activar;
  Prueba.findOne({idTest:id}, function(err, prueba){
    if(err){
      res.status(400);
      res.send('Error al activar la prueba');
    };
    prueba.activar = activar;
    prueba.save(function(error){
      if(error){
        res.status(400);
        res.send('Error al activar la prueba');
      }else{
        res.send('OK');
      };
    });
  });
});

router.post('/verInfo', function(req, res, next) {
  var id = req.body.ID;

  Prueba.findOne({idTest:id}, function(err, prueba){
    if(err){
      res.status(400);
      res.send('Error al buscar informacion');
    }else{
      res.send(prueba);
    };
  });
});

router.get('/crearPrueba', function(req, res, next) {
  res.render('prueba/crearPrueba');
});

router.post('/crearPrueba', function(req, res, next) {
  var idTest = req.body.idTest;
  var tipoTrx = req.body.tipoTrx;
  var isoTest = req.body.isoTest;
  var activar = true;
  var descripcion = req.body.descripcion;
  var ultimaEjecucion = false;
  var isoUltimaEjecucion  = null;

  var data = {
    idTest,
    tipoTrx,
    isoTest,
    activar,
    descripcion,
    ultimaEjecucion,
    isoUltimaEjecucion
  };
  var prueba = new Prueba(data);

  prueba.save(function(err){
    if(err){
        console.log(err);
        res.render('prueba/crearPrueba', {error:'<div class="card-panel red darken-2" style="color: rgba(255, 255, 255, 0.9);"><span>No se pudo crear la prueba</span><i class="material-icons right" onclick="Cerrar()">close</i></div>'});
    }else{
      res.render('prueba/crearPrueba', { error:'<div class="card-panel green darken-2" style="color: rgba(255, 255, 255, 0.9);"><span>La prueba se creo correctamente</span><i class="material-icons right" onclick="Cerrar()">close</i></div>' });
    }
  });
});
module.exports = router;
