'use strict'

const mongoose = require('mongoose');
const bCrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
  isActive: {
    type: Boolean,
    default: true
  },
  fullName: {
    type: String,
    uppercase: true
  },
  email: {
    type: String,
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  registerDate: {
    type: Date,
    default: Date.now
  },
  inactiveDate: {
    type: Date
  },
  pictureURL: {
    type: String
  },
  accType: {
    type: String,
    enum: [
      'member', 'default', 'admin', 'doctor',
      'recepcionist', 'capturist',
      'memberAgent', 'doctorAgent', 'noMember'
    ],
    default: 'member',
    required: true
  },
  cp: {
    type: String
  }, //código postal
  cellphone: {
    type: String
  },
  country: {
    type: String,
    trim: true,
    uppercase: true
  },
  address: {
    type: String,
    trim: true,
    uppercase: true
  },
  occupation: {
    type: String,
    enum: ['Estudiante', 'Empleado', 'Empresario',
      'Desempleado', 'Encargado del hogar',
      'Profesionista independiente'
    ]
  },
  civilStatus: {
    type: String,
    enum: ['Soltero', 'Casado', 'Unión libre', 'Divorciado', ' Viudo']
  },
  scholarship: {
    type: String,
    enum: ['Primaria', 'Secundaria', 'Preparatoria',
      'Licenciatura', 'Posgrado'
    ]
  },
  religion: {
    type: String,
    enum: ['Católico', 'Judío', 'Ortodoxos', 'Otro']
  },
  membership: {
    type: Schema.Types.ObjectId,
    ref: 'Membership'
  },
  medicalRecord: {
    type: Schema.Types.ObjectId,
    ref: 'MemberMedicalRecord'
  },
  doctorProfile: {
    type: Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  registeredBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  birthday: {
    type: Date,
    default: Date.now
  },
  //SEGUN LA NOM
  name: {
    type: String,
    uppercase: true,
    required: true
  },
  dadLastName: {
    type: String,
    uppercase: true,
    required: true
  },
  momLastName: {
    type: String,
    uppercase: true,
    required: true
  },
  municipio: {
    type: String,
    trim: true,
    uppercase: true
  },
  localidad: {
    type: String,
    trim: true,
    uppercase: true
  },
  nac_origen: {
    type: String,
    trim: true,
    uppercase: true
  },
  edo_nac: {
    type: String,
    trim: true,
    uppercase: true
  },
  residence: {
    type: String,
    trim: true,
    uppercase: true
  },
  curp: {
    type: String,
    trim: true,
    uppercase: true
  },
  gender: {
    type: String,
    enum: ['M', 'H'],
    default: 'M'
  },
  folio:{
    type: String,
    uppercase: true,
    trim: true
  },
  fecnac:{
    type: String
  }

}, {
  runSettersOnQuery: true
});

//Generar el hashSync
userSchema.methods.generateHash = function(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bCrypt.compareSync(password, this.password);
};

userSchema.methods.validToken = function(token) {
  return bCrypt.compareSync(token, this.verificationCode);
}

userSchema.methods.getAccTypes = function() {
  return userSchema.path('accType').enumValues;
};

module.exports = mongoose.model('User', userSchema);
