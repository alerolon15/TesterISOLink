var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var transaccionSchema = new Schema({
  idTest: {type:Number, unique:true},
  tipoTrx: {type: String},
  isoTest: {type: String},
  activar: {type: Boolean},
  descripcion: {type: String},
  ultimaEjecucion: {type:Boolean},
  isoUltimaEjecucion: {type:String},
  resultadoRecibido: {type:String},
  resultadoEsperado: {type:String}
});

module.exports = mongoose.model('Transaccion', transaccionSchema);
