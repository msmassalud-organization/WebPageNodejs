var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var doctorSchema = new mongoose.Schema({
  user : {type: Schema.Types.ObjectId, ref: 'User'},
  cedula : {type: String},
  speciality: {type: String},
  cv: {type: String},
  patients : {type: [Schema.Types.ObjectId], ref: 'User'}
}, { runSettersOnQuery: true });

module.exports = mongoose.model('Doctor', doctorSchema);
