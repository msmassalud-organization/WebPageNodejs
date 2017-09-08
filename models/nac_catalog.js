'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

var nac_catalogSchema = new Schema({
  codigo_pais: Number,
  pais: {
    type: String,
    uppercase: true
  },
  clave_nacionalidad: String
});

module.exports = mongoose.model('NAC_CATALOG',nac_catalogSchema);
