var express = require('express');
var router = express.Router();
var Parseador = require('../models/iso');
var Canal = require('../models/canal');
var Cuenta = require('../models/cuenta');
var Prueba = require('../models/transacciones');
var bodyParser = require('body-parser');
var net = require('net');

// funcion para rellenar con 0 valores a la derecha
function padingR(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : n + new Array(width - n.length + 1).join(z);
};
// funcion para rellenar con 0 valores a la izquierda
function padingL(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};


/* GET home page. */
router.post('/', function(req, res, next) {
  var idTest = req.body.ID;
  Canal.find({}, function(err, canal) {
    Cuenta.find({}, function(err, cuenta){
      Prueba.find({idTest:idTest},function(err, prueba) {

        var iso = prueba[0].isoTest;
        var isoParseado = new Parseador(iso);

        var iso = setearDatosISO(isoParseado, prueba, cuenta, iso);
        //console.log(iso);

        var puerto = canal[0].puerto;
        var ip = canal[0].ip;
        var client = new net.Socket();
        var date1 = new Date();
        // conecta al Socket y envia el mensaje, dependiendo si es TCPP o TCP envia el tamaño del buffer al comienzo del mensaje
        client.connect(puerto, ip, function() {
          var length = iso.length;
          client.write(length + iso);
        });
        // En caso de recibir informacion por el socket
        client.on('data', function(data) {

          var respuestaOK = false;
          var datos = data.toString('ascii');
          if (datos.substr(0,3) == "ISO") {

              var datosParseado = new Parseador(datos);

              var date2 = new Date();
              var dif = Math.abs((date2.getTime() - date1.getTime()))

              var campo39 = datosParseado.Campos.find( campo => campo.Campo === 'F39' );
              var campo44 = datosParseado.Campos.find( campo => campo.Campo === 'F44' );

              if (campo39.Valor == prueba[0].resultadoEsperado) {
                respuestaOK = true;
              };
              prueba[0].ultimaEjecucion = respuestaOK;
              prueba[0].isoUltimaEjecucion = datos;
              prueba[0].isoTest = iso;
              prueba[0].resultadoRecibido = campo39.Valor;

              prueba[0].save(err,function() {
                if (err) {
                  res.send({resultado: false, error: '<div class="card-panel red darken-2" style="color: rgba(255, 255, 255, 0.9);"><span>Algo Salió Mal: Con la base de datos. Error: ' + err + '</span><i class="material-icons right" onclick="Cerrar()">close</i></div>' })
                }else{

                  res.send({resultado: respuestaOK, tiempo:dif});
                  client.destroy();
                };
              });
          };
        });

        // En caso de recibir error
        client.on('error', function(data) {
          //console.log(data);
          // si se recibe un codigo de error especifico se devuelve a la vista el codigo con un mensaje de error de falla de conexion
          if (data.code) {
            res.send({ error: '<div class="card-panel red darken-2" style="color: rgba(255, 255, 255, 0.9);"><span>Algo Salió Mal: no se pudo conectar a la ip y puerto establecido. Error: ' + data.code + '</span><i class="material-icons right" onclick="Cerrar()">close</i></div>' })
          }
        });
        // En caso de cierre del socket
        client.on('close', function() {
          //console.log('Conexion Cerrada!');
        });
      });
    });
  });
});

function setearDatosISO(isoParseado, prueba, cuenta, iso ){

  const campo3 = isoParseado.Campos.find( campo => campo.Campo === 'F3' );
  const campo7 = isoParseado.Campos.find( campo => campo.Campo === 'F7' );
  const campo12 = isoParseado.Campos.find( campo => campo.Campo === 'F12' );
  const campo13 = isoParseado.Campos.find( campo => campo.Campo === 'F13' );
  const campo17 = isoParseado.Campos.find( campo => campo.Campo === 'F17' );
  const campo35 = isoParseado.Campos.find( campo => campo.Campo === 'F35' );
  const campo37 = isoParseado.Campos.find( campo => campo.Campo === 'F37' );
  const campo102 = isoParseado.Campos.find( campo => campo.Campo === 'F102' );
  const campo103 = isoParseado.Campos.find( campo => campo.Campo === 'F103' );

  // sumo uno al numero de sequencia;
  var INTcampo37 = parseInt(campo37.Valor);
      INTcampo37 = INTcampo37 + 1;
      INTcampo37 = padingL(INTcampo37, 6, '0');
      INTcampo37 = padingR(INTcampo37, 12, ' ');
  iso = iso.replace(campo37.Valor, INTcampo37);

  //según el tipo de cuenta seteamos en el campo correspondiente (102 origen, 103 destino)
  var tipoCuentaOrigen = campo3.Valor.substring(2, 4);
  var tipoCuentaDestino = campo3.Valor.substring(4, 6);
  if (tipoCuentaOrigen == "10" || tipoCuentaDestino == "10") {
    cuenta[0].CajaAhorroPesos = padingR(cuenta[0].CajaAhorroPesos, 28, ' ');
    if (tipoCuentaOrigen == "10") {
      iso = iso.replace(campo102.Valor, cuenta[0].CajaAhorroPesos);
    };
    if (tipoCuentaDestino == "10") {
      iso = iso.replace(campo103.Valor, cuenta[0].CajaAhorroPesos);
    };
  };
  if (tipoCuentaOrigen == "20" || tipoCuentaDestino == "20") {
    cuenta[0].CuentaCorrientePesos = padingR(cuenta[0].CuentaCorrientePesos, 28, ' ');
    if (tipoCuentaOrigen == "20") {
      iso = iso.replace(campo102.Valor, cuenta[0].CuentaCorrientePesos);
    };
    if (tipoCuentaDestino == "20") {
      iso = iso.replace(campo103.Valor, cuenta[0].CuentaCorrientePesos);
    };
  };
  if (tipoCuentaOrigen == "07" || tipoCuentaDestino == "07") {
    cuenta[0].CuentaCorrienteDolares = padingR(cuenta[0].CuentaCorrienteDolares, 28, ' ');
    if (tipoCuentaOrigen == "07") {
      iso = iso.replace(campo102.Valor, cuenta[0].CuentaCorrienteDolares);
    };
    if (tipoCuentaDestino == "07") {
      iso = iso.replace(campo103.Valor, cuenta[0].CuentaCorrienteDolares);
    };
  };
  if (tipoCuentaOrigen == "15" || tipoCuentaDestino == "15") {
    cuenta[0].CajaAhorroDolares = padingR(cuenta[0].CajaAhorroDolares, 28, ' ');
    if (tipoCuentaOrigen == "15") {
      iso = iso.replace(campo102.Valor, cuenta[0].CajaAhorroDolares);
    };
    if (tipoCuentaDestino == "15") {
      iso = iso.replace(campo103.Valor, cuenta[0].CajaAhorroDolares);
    };
  };
  //Seteamos el numero de tarjeta asociada
  var signoTarjeta = campo35.Valor.indexOf('=');
  if (signoTarjeta > 0) {
    var tarjetaIso = campo35.Valor.substring(0, signoTarjeta);
    iso = iso.replace(tarjetaIso, cuenta[0].TarjetaAsociada);
  };

  // seteamos todos los campos de fechas con la del dia.
  var d = new Date();
  var DD =  d.getDate();
      DD = padingL(DD, 2, 0);
  var MM =  d.getMonth() + 1;
      MM = padingL(MM, 2, 0);
  var YY =  d.getFullYear();
      YY = padingL(YY, 2, 0);
  var hora = d.getHours();
      hora = padingL(hora, 2, 0);
  var min = d.getMinutes();
      min = padingL(min, 2, 0);
  var seg = d.getSeconds();
      seg = padingL(seg, 2, 0);

  var valorCampo7 = MM + DD + hora + min + seg;
  var valorCampo12 = hora + min + seg;
  var valorCampo13 = MM + DD;
  var valorCampo17 = MM + DD;

  var campos1317 = campo13.Valor + "0000" + campo17.Valor;
  var camposNuevos = valorCampo13 + "0000" + valorCampo17;
  iso = iso.replace(campos1317, camposNuevos);
  iso = iso.replace(campo7.Valor, valorCampo7);
  iso = iso.replace(campo12.Valor, valorCampo12);

  return iso;
};

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
        //console.log('Enviado: ' + iso);
        client.write(length + iso);
      }else{
        // en caso de hacer una conexion TCP
        //console.log('Enviado: ' + iso);
        client.write(iso);
      }
    });

    // En caso de recibir informacion por el socket
    client.on('data', function(data) {
      //console.log('Received: ' + data);
      var datos = data.toString('ascii');
      //client.destroy(); // destruye el server despues de la respuesta del Server

      // si recibe otra cosa diferente a una ISO no hace nada, en caso de recibir una ISO retorna el mensaje
      if (datos.substr(0,3) == "ISO") {
        res.send({ ISO: datos });
      }
    });

    // En caso de recibir error
    client.on('error', function(data) {
      //console.log(data);
      // si se recibe un codigo de error especifico se devuelve a la vista el codigo con un mensaje de error de falla de conexion
      if (data.code) {
        res.send({ error: '<div class="card-panel red darken-2" style="color: rgba(255, 255, 255, 0.9);"><span>Algo Salió Mal: no se pudo conectar a la ip y puerto establecido. Error: ' + data.code + '</span><i class="material-icons right" onclick="Cerrar()">close</i></div>' })
      }
    });

    // En caso de cierre del socket
    client.on('close', function() {
      //console.log('Conexion Cerrada!');
    });
  }
});
module.exports = router;
