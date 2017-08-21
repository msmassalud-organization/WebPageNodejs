const mongoose = require('mongoose')
var Schema = mongoose.Schema;

var questionarySchema = new Schema({
  name: {type: String},
  questions: {type: [Schema.Types.ObjectId], ref: 'Question'}
});

module.exports = mongoose.model('Questionary', questionarySchema);
