const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
  status: {
    type: String,
    trim: true,
    enum: [
      'Pendiente',
      'Cancelada'
    ],
    default: 'Pendiente'
  },
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  doctor: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  vitalSigns: {
    hearthRate: Number,
    oxygenSaturation: Number,
    sBloodPress: Number,
    dBloodPress: Number,
    weight: Number,
    height: Number
  },
  eventId: Number,
  calendar: {
    title: {
      type: String,
      uppercase: true
    },
    start: Date,
    end: Date,
    allDay: {type:Boolean, default: false},
    url: String,
    className: {
      type: String,
      enum: [
        'event-blue', 'event-azure', 'event-green',
        'event-orange', 'event-orange'
      ],
      default: 'event-blue'
    }
  }
});
autoIncrement.initialize(mongoose.connection);
eventSchema.plugin(autoIncrement.plugin, {model: 'Event', field: 'eventId'});
module.exports = mongoose.model('Event', eventSchema);
