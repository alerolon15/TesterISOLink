module.exports = function tipoTrx() {
	var tipoTRXJson = [
    {tipoTrx : "Consulta de Saldo", codigoTrx: "31"},
    {tipoTrx : "Ultimos Movimientos", codigoTrx: "94"},
    {tipoTrx : "Extraccion", codigoTrx: "01"},
    {tipoTrx : "Deposito", codigoTrx: "21"},
    {tipoTrx : "Pagos Link y AFIP", codigoTrx: "81"},
    {tipoTrx : "Transferencia 40", codigoTrx: "40"},
    {tipoTrx : "Transferencia CBU", codigoTrx: "1B"},
    {tipoTrx : "Compra con Debito", codigoTrx: "71"},
    {tipoTrx : "Anulacion Compra", codigoTrx: "72"},
    {tipoTrx : "Devolucion Compra", codigoTrx: "74"},
    {tipoTrx : "Trans. Inmediata Debito", codigoTrx: "09"},
    {tipoTrx : "Trans. Inmediata Credito", codigoTrx: "29"},
    {tipoTrx : "Pescadora", codigoTrx: "69"},
    {tipoTrx : "Consulta tipo de cambio", codigoTrx: "35"},
    {tipoTrx : "Consulta Publicitaria Plazo fijo", codigoTrx: "37"},
    {tipoTrx : "Consulta Saldo Plazo fijo", codigoTrx: "38"},
    {tipoTrx : "Verificacion Cuenta Credito inmediata", codigoTrx: "39"}
  ];

	return tipoTRXJson;
};
