const mongoose = require('mongoose')
var Schema = mongoose.Schema;

var serviceSchema = new Schema({
  CveEstu: {
    type: String
  },
  classification: {
    type: String
  },
  name: {
    type: String,
    uppercase: true
  },
  gPrice: Number,
  mPrice: Number,
  cPrice: Number,
  directions: {
    type: String,
    uppercase: true
  }
});

module.exports = mongoose.model('Service', serviceSchema);
