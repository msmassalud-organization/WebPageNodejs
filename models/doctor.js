var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var doctorSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  cedula: {
    type: String
  },
  speciality: {
    type: String
  },
  cv: {
    type: String
  },
  patients: {
    type: [Schema.Types.ObjectId],
    ref: 'User'
  },
  monday: {
    available: {
      type: Boolean,
      default: true
    },
    start: Date,
    end: Date
  },
  tuesday: {
    available: {
      type: Boolean,
      default: true
    },
    start: Date,
    end: Date
  },
  wednesday: {
    available: {
      type: Boolean,
      default: true
    },
    start: Date,
    end: Date
  },
  thursday: {
    available: {
      type: Boolean,
      default: true
    },
    start: Date,
    end: Date
  },
  friday: {
    available: {
      type: Boolean,
      default: true
    },
    start: Date,
    end: Date
  },
  saturday: {
    available: {
      type: Boolean,
      default: false
    },
    start: Date,
    end: Date
  },
  sunday: {
    available: {
      type: Boolean,
      default: false
    },
    start: Date,
    end: Date
  },
  agenda: {
    type: [Schema.Types.ObjectId],
    ref: 'Event'
  },
  trk: [{
    service: String,
    price: Number,
    duration: Number
  }]
}, {
  runSettersOnQuery: true
});

module.exports = mongoose.model('Doctor', doctorSchema);
