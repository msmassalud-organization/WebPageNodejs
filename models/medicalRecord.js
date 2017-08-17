var mongoose = require('mongoose');
var bCrypt   = require('bcrypt-nodejs');
var Schema   = mongoose.Schema;

var medicalSchema = new mongoose.Schema({
  dadRecord : {
    isAlive: {type: Boolean},
    diabetes: {type: String,
                enum: ['Y','N','U']
              },
    //arreglo: [String],
    diabetesType: {type: String}

  },

  momRecord: {

  }
});

module.exports = mongoose.model('MedicalRecord', medicalSchema);
