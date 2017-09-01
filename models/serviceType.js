const mongoose = require('mongoose')
const Schema = mongoose.Schema;

var serTypeSchema = new Schema({
  classification: {
    type: String,
    unique: true
  },
  area: {
    type: String,
    enum: [
      'Imagenología', 'Especialidades médicas',
      'Laboratorio clínico', 'Clínica ambulatoria'
    ]
  },
  desciption: {
    type: String
  }
});

module.exports = mongoose.model('ServiceType', serTypeSchema);
