const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bCrypt = require('bcrypt-nodejs');
const randToken = require('rand-token')
const mongooseToCsv = require('mongoose-to-csv')

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
      return randToken.generate(8,"ABCDEFGHIJKLMN0PQRSTUVWXYZ0123456789");
    },
    required: true
  },
  isActive: {
    type: Boolean,
    default: 'false'
  },
  folio: {
    type: Number,
  },
  completedMR: {
    type: Boolean,
    default: false
  },
  freeBC: {
    type: Boolean,
    default: false
  }
});

membershipSchema.plugin(mongooseToCsv,{
  headers: 'memberId verificationCode',
  constraints: {
    'memberId': 'memberId',
    'verificationCode': 'verificationCode'
  }
});
module.exports = mongoose.model('Membership', membershipSchema);
