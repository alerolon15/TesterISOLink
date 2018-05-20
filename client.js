var net = require('net');

// Creamos el cliente Socket
var client = new net.Socket();

//console.log(ip, puerto)
var puerto = 13005;
var ip = '127.0.0.1';
var tcpp = true;
var iso = 'ISO0140000500800822000000000000004000000000000001214174203150972001';
// conecta al Socket y envia el mensaje, dependiendo si es TCPP o TCP envia el tamaño del buffer al comienzo del mensaje
client.connect(puerto, ip, function() {

  if (tcpp) {
    // en caso de hacer una conexion TCPP se envia el tamaño del mensaje como cabecera
    var length = iso.length;
    client.write(length + iso);
  }else{
    // en caso de hacer una conexion TCP
    client.write(iso);
  }
});

// En caso de recibir informacion por el socket
client.on('data', function(data) {
  console.log('Received: ' + data);
  var datos = data.toString('ascii');
  //client.destroy(); // destruye el server despues de la respuesta del Server
  console.log('evento data');
  console.log(datos);
});

// En caso de recibir error
client.on('error', function(data) {
  console.log('evento error');
  console.log(data);
  // si se recibe un codigo de error especifico se devuelve a la vista el codigo con un mensaje de error de falla de conexion
});

// En caso de cierre del socket
client.on('close', function() {
  console.log('Conexion Cerrada!');
});
