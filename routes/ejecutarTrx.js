var express = require('express');
var router = express.Router();
var Parseador = require('../models/iso');
var Canal = require('../models/canal');
var Cuenta = require('../models/cuenta');
var Prueba = require('../models/transacciones');
var bodyParser = require('body-parser');
var net = require('net');

function pading(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : n + new Array(width - n.length + 1).join(z);
};

/* GET home page. */
router.post('/', function(req, res, next) {
  var idTest = req.body.ID;
  Cuenta.find({}, function(err, cuenta){
    Prueba.find({idTest:idTest},function(err, prueba) {

      var iso = prueba[0].isoTest;
      var isoParseado = new Parseador(iso);

      const campo3 = isoParseado.Campos.find( campo => campo.Campo === 'F3' );
      const campo102 = isoParseado.Campos.find( campo => campo.Campo === 'F102' );
      const campo103 = isoParseado.Campos.find( campo => campo.Campo === 'F103' );
      const campo35 = isoParseado.Campos.find( campo => campo.Campo === 'F35' );

      //revisamos segun tipo de transaccion que cuentas hay que reemplazar
      var tipoCuentaOrigen = campo3.Valor.substring(2, 4);
      var tipoCuentaDestino = campo3.Valor.substring(4, 6);

      if (tipoCuentaOrigen == "10" || tipoCuentaDestino == "10") {
        cuenta[0].CajaAhorroPesos = pading(cuenta[0].CajaAhorroPesos, 28, ' ');
        if (tipoCuentaOrigen == "10") {
          iso = iso.replace(campo102.Valor, cuenta[0].CajaAhorroPesos);
        };
        if (tipoCuentaDestino == "10") {
          iso = iso.replace(campo103.Valor, cuenta[0].CajaAhorroPesos);
        };
      };
      if (tipoCuentaOrigen == "20" || tipoCuentaDestino == "20") {
        cuenta[0].CuentaCorrientePesos = pading(cuenta[0].CuentaCorrientePesos, 28, ' ');
        if (tipoCuentaOrigen == "20") {
          iso = iso.replace(campo102.Valor, cuenta[0].CuentaCorrientePesos);
        };
        if (tipoCuentaDestino == "20") {
          iso = iso.replace(campo103.Valor, cuenta[0].CuentaCorrientePesos);
        };
      };
      if (tipoCuentaOrigen == "07" || tipoCuentaDestino == "07") {
        cuenta[0].CuentaCorrienteDolares = pading(cuenta[0].CuentaCorrienteDolares, 28, ' ');
        if (tipoCuentaOrigen == "07") {
          iso = iso.replace(campo102.Valor, cuenta[0].CuentaCorrienteDolares);
        };
        if (tipoCuentaDestino == "07") {
          iso = iso.replace(campo103.Valor, cuenta[0].CuentaCorrienteDolares);
        };
      };
      if (tipoCuentaOrigen == "15" || tipoCuentaDestino == "15") {
        cuenta[0].CajaAhorroDolares = pading(cuenta[0].CajaAhorroDolares, 28, ' ');
        if (tipoCuentaOrigen == "15") {
          iso = iso.replace(campo102.Valor, cuenta[0].CajaAhorroDolares);
        };
        if (tipoCuentaDestino == "15") {
          iso = iso.replace(campo103.Valor, cuenta[0].CajaAhorroDolares);
        };
      };
      //pasarlo a una funcion

      var signoTarjeta = campo35.Valor.indexOf('=');
      if (signoTarjeta > 0) {
        var tarjetaIso = campo35.Valor.substring(0, signoTarjeta);
        var iso = iso.replace(tarjetaIso, cuenta[0].TarjetaAsociada);
      };


      ////cuenta[0].TarjetaAsociada = pading(cuenta[0].TarjetaAsociada, 28, ' ');
      ////iso = iso.replace(campo35.Valor, cuenta[0].TarjetaAsociada);
      ////console.log(iso);
      //console.log(campo3.Valor);
      //console.log(campo102.Valor);

      res.send('OK');
    });
  });
});

/* POST para el metodo Parsear, toma el mensaje ISO del input, y con la clase Parseador devuelve un JSON con los datos parseados */
router.post('/otros', function(req, res, next) {
  // recibe valores del Form
  var iso = req.body.ISO;
  var ip = req.body.IP;
  var puerto = req.body.Puerto;

  // si el input esta vacio devuelve error
  if (iso == "") {
    res.render('index', { error: '<div class="card-panel red darken-2" style="color: rgba(255, 255, 255, 0.9);"><span>No ingreso Ninguna ISO</span><i class="material-icons right" onclick="Cerrar()">close</i></div>' })
  }else{
    // convierte la ISO a json y lo devuelve a la vista
    var isoParseado = new Parseador(iso);
    res.render('index', { ISO: isoParseado, body: req.body });
  }
});

/* Llamado por AJAX al metodo Enviar, emula una transaccion hacia un IP y puerto especifico */
router.post('/Enviar', function(req, res, next) {
  var iso = req.body.ISO;
  var ip = req.body.IP;
  var puerto = req.body.Puerto;
  var tcpp = req.body.TCPP;

  // si los datos del form vienen vacios devuelve un error a la vista
  if (!iso || !ip || !puerto) {
    res.send({ error: '<div class="card-panel red darken-2" style="color: rgba(255, 255, 255, 0.9);"><span>Faltan datos para la emulacion!</span><i class="material-icons right" onclick="Cerrar()">close</i></div>' });
  }else{
    var isoParseado = new Parseador(iso);

    // Creamos el cliente Socket
    var client = new net.Socket();

    //console.log(ip, puerto)

    // conecta al Socket y envia el mensaje, dependiendo si es TCPP o TCP envia el tamaño del buffer al comienzo del mensaje
    client.connect(puerto, ip, function() {

      if (tcpp) {
        // en caso de hacer una conexion TCPP se envia el tamaño del mensaje como cabecera
        var length = iso.length;
        console.log('Enviado: ' + iso);
        client.write(length + iso);
      }else{
        // en caso de hacer una conexion TCP
        console.log('Enviado: ' + iso);
        client.write(iso);
      }
    });

    // En caso de recibir informacion por el socket
    client.on('data', function(data) {
      console.log('Received: ' + data);
      var datos = data.toString('ascii');
      //client.destroy(); // destruye el server despues de la respuesta del Server

      // si recibe otra cosa diferente a una ISO no hace nada, en caso de recibir una ISO retorna el mensaje
      if (datos.substr(0,3) == "ISO") {
        res.send({ ISO: datos });
      }
    });

    // En caso de recibir error
    client.on('error', function(data) {
      console.log(data);
      // si se recibe un codigo de error especifico se devuelve a la vista el codigo con un mensaje de error de falla de conexion
      if (data.code) {
        res.send({ error: '<div class="card-panel red darken-2" style="color: rgba(255, 255, 255, 0.9);"><span>Algo Salió Mal: no se pudo conectar a la ip y puerto establecido. Error: ' + data.code + '</span><i class="material-icons right" onclick="Cerrar()">close</i></div>' })
      }
    });

    // En caso de cierre del socket
    client.on('close', function() {
      console.log('Conexion Cerrada!');
    });
  }
});
module.exports = router;
