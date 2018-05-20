var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var canalSchema = new Schema({
  ip: {type: String},
  puerto: {type: String},
  tipoCanal: {type: String}
});

module.exports = mongoose.model('Canal', canalSchema);
