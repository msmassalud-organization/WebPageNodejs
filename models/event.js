const mongoose = require('mongoose')
var Schema = mongoose.Schema;

var eventSchema = new Schema({
  type: {type: String, trim: true},
  date : {type: Date, default: Date.now},
  patient : { type: Schema.Types.ObjectId, ref: 'User' },
  doctor: { type: Schema.Types.ObjectId, ref: 'User' },
  vitalSigns : {
      hearthRate: Number,
      oxygenSaturation: Number,
      sBloodPress: Number,
      dBloodPress: Number,
      weight: Number,
      height: Number
  }

});

module.exports = mongoose.model('Event', eventSchema);
