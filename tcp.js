/*
In the node.js intro tutorial (http://nodejs.org/), they show a basic tcp
server, but for some reason omit a client connecting to it.  I added an
example at the bottom.
Save the following server in example.js:
*/

const net = require('net');
const server = net.createServer((c) => {
	console.log('server creado!');
});

server.on('error', (err) => {
  throw err;
});
server.on('connection', (skt) => {
	var sktAddress = skt.address();
	var sktAddress = JSON.stringify(sktAddress);
		console.log('evento de conexion: ' + sktAddress);

		// envio 0800
		//var iso = 'ISO0140000500800822000000000000004000000000000001214174203150972001';
		//var length = iso.length;

		//skt.write(length + iso);

	skt.on('data', (data) => {
		var datos = data.toString('ascii');
		// recibo 0800
		console.log('recibi: ' + datos);

		// si es un 0800 devuelvo 0810
		if (datos.indexOf('0800') > 0) {
			var isoResp = datos.replace('0800', '0810');
			var long = isoResp.length;
			console.log('respondi: ' + isoResp);
			skt.write(long + isoResp);
		};
	});
	skt.on('error', (err) => {
		console.log(err);
	});
});

server.on('close', (cls) => {
  console.log('evento de cierre');
});

server.on('listening', (lst) => {
	var address = server.address();
	var address = JSON.stringify(address);
	console.log('Servidor escuchando en: ' + address);
});

server.listen(13005, '127.0.0.1', () => {
  console.log('Servidor Iniciado!');
});
