'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

var systemEventSchema = new Schema({
  description: {
    type: String,
    uppercase: true
  },
  performedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SystemEvent', systemEventSchema);
