const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bCrypt = require('bcrypt-nodejs');
const randToken = require('rand-token')

var membershipSchema = new Schema({
  memberId: {
    type: Number,
    unique: true
  },
  startDate: {
    type: Date
  },
  expiringDate: {
    type: Date
  },
  type: {
    type: String,
    enum: ['A', 'B', 'C']
  },
  userProfile: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  helpedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  verificationCode: {
    type: String,
    default: function() {
      return randToken.generate(6);
    },
    required: true
  },
  isActive: {
    type: Boolean,
    default: 'false'
  }
});

module.exports = mongoose.model('Membership', membershipSchema);
