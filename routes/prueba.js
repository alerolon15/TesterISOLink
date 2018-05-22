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
      var isoInput = new Parseador(prueba.isoTest);
      var isoOutput = new Parseador(prueba.isoUltimaEjecucion);

      
      var result = {
        _id: prueba._id,
        idTest: prueba.idTest,
        isoTest: prueba.isoTest,
        activar: prueba.activar,
        descripcion: prueba.descripcion,
        ultimaEjecucion: prueba.ultimaEjecucion,
        isoUltimaEjecucion: prueba.isoUltimaEjecucion,
        resultadoEsperado: prueba.resultadoEsperado,
        tipoTrx: prueba.tipoTrx,
        resultadoRecibido: prueba.resultadoRecibido,
        isoInput: isoInput,
        isoOutput: isoOutput

      };

      res.send(result);
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
  var resultadoEsperado  = req.body.resultadoEsperado;
  var resultadoRecibido  = req.body.resultadoRecibido;

  var data = {
    idTest,
    tipoTrx,
    isoTest,
    activar,
    descripcion,
    ultimaEjecucion,
    isoUltimaEjecucion,
    resultadoEsperado,
    resultadoRecibido
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

router.get('/editar/:id', function(req, res, next) {
  var pruebaEditar = req.params.id;
  Prueba.find({idTest:pruebaEditar}, function(err, prueba) {
    var pruebaID = prueba[0];
    res.render('prueba/editarPrueba',{ prueba: pruebaID });
  });
});

router.post('/editar/:id', function(req, res, next) {
  var pruebaEditar = req.params.id;
  Prueba.find({idTest:pruebaEditar}, function(err, prueba) {
    prueba[0].tipoTrx = req.body.tipoTrx;
    prueba[0].isoTest = req.body.isoTest;
    prueba[0].descripcion = req.body.descripcion;
    prueba[0].resultadoEsperado  = req.body.resultadoEsperado;

    prueba[0].save(function(err) {
      if(err){
          console.log(err);
          res.render('prueba/editarPrueba', {error:'<div class="card-panel red darken-2" style="color: rgba(255, 255, 255, 0.9);"><span>No se pudo editar la prueba</span><i class="material-icons right" onclick="Cerrar()">close</i></div>',prueba: prueba});
      }else{
        res.redirect('/prueba');
      }
    });
  });
});

router.get('/borrar/:id', function(req, res, next) {
    var pruebaBorrar = req.params.id;

    Prueba.find({idTest:pruebaBorrar}, function(err, prueba){
      var pruebaBorrado = prueba[0]._id;
      Prueba.findByIdAndRemove(pruebaBorrado,function(err) {
        if(err) {
          res.render('prueba/index', {error: '<div class="card-panel red darken-2" style="color: rgba(255, 255, 255, 0.9);"><span>Algo fallo en la base de datos</span><i class="material-icons right" onclick="Cerrar()">close</i></div>'});
        }else{
          res.redirect('/prueba');
        };
      });
    });
});

module.exports = router;
