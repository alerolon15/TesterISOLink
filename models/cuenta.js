var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cuentaSchema = new Schema({
  TarjetaAsociada: {type: String},
  nroBanco: {type: String},
  CajaAhorroPesos: {type: String},
  CajaAhorroDolares: {type: String},
  CuentaCorrientePesos: {type: String},
  CuentaCorrienteDolares: {type: String}
});

module.exports = mongoose.model('Cuenta', cuentaSchema);
