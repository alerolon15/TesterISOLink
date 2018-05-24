module.exports = function tipoRespuestaTrx() {
	var tipoRespuestaTRXJson = [
    {tipoRespuestaTrx : "Aprobada", codigoRespuestaTrx: "00"},
    {tipoRespuestaTrx : "insuficiente", codigoRespuestaTrx: "51"},
    {tipoRespuestaTrx : "Sistema no disponible", codigoRespuestaTrx: "88"},
    {tipoRespuestaTrx : "Cuenta invalida", codigoRespuestaTrx: "76"},
    {tipoRespuestaTrx : "Error de Sistema", codigoRespuestaTrx: "91"},
    {tipoRespuestaTrx : "Monto Invalido", codigoRespuestaTrx: "13"},
    {tipoRespuestaTrx : "Tarjeta Invalida", codigoRespuestaTrx: "14"},
    {tipoRespuestaTrx : "Tarjeta Vencida", codigoRespuestaTrx: "54"},
    {tipoRespuestaTrx : "Sin registro de Tarjeta", codigoRespuestaTrx: "57"},
    {tipoRespuestaTrx : "Transaccion invalida para la tarjeta", codigoRespuestaTrx: "57"},
    {tipoRespuestaTrx : "Transaccion invalida para la terminal", codigoRespuestaTrx: "58"},
    {tipoRespuestaTrx : "Tarjeta perdida o robada", codigoRespuestaTrx: "41"}
  ];

	return tipoRespuestaTRXJson;
};
