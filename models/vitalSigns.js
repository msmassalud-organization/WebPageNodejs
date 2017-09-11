const mongoose = require('mongoose')
const Schema = mongoose.Schema

var vitalSignSchema = new Schema({
  hearthRate: Number, //20 - 200 lpm
  oxygenSaturation: Number, //0 - 100%
  sBloodPress: Number, //80 - 200 mm/Hg
  dBloodPress: Number, //50 - 150 mm/Hg
  weight: Number, //1 - 200 Kgs
  height: Number //10 - 250 cms
  user : {type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('VitalSigns', vitalSignSchema);
