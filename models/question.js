const mongoose = require('mongoose')
var Schema = mongoose.Schema;

var questionSchema = new Schema({
  type: {String,
          enum:['Radio','ComboBox','Checkbox','TextoAbierto'],
          default: 'Radio', required: true},
  question: {type: String, unique: true, required: true},
  options: [String],
  defaultIndex: Number,
  radioInLine: Boolean,
  textArea: Boolean,
  textUppercase: Boolean,
  variableName: String,
  answer: String
});

module.exports = mongoose.model('Question', questionSchema);
