const mongoose = require('mongoose')
var Schema = mongoose.Schema;

var diseaseSchema = new Schema({
  diabetes : {type: [String]},
  cancer: {type:[String]},
  hearth: {type:[String]},
  lung: {type:[String]},
  kidney: {type:[String]},
  liver: {type:[String]}
});

module.exports = mongoose.model('Diseases', diseaseSchema);
