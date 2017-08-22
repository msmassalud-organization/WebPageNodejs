var mongoose = require('mongoose');
var bCrypt   = require('bcrypt-nodejs');
var Schema   = mongoose.Schema;

var userSchema = new mongoose.Schema({
  isActive:     {type: Boolean, default: true},
  name:         {type: String, uppercase: true, required: true},
  dadLastName:  {type: String, uppercase: true, required: true},
  momLastName:  {type: String, uppercase: true, required: true},
  birthday:     {type: Date, default:Date.now},
  email:        {type: String, lowercase: true, unique: true},
  password:     {type: String, required: true},
  registerDate: {type: Date, default:Date.now},
  inactiveDate: {type: Date},
  accType:      {type: String,
                  enum : [
                    'member','default','admin','doctor',
                    'recepcionist', 'capturist',
                    'memberAgent','doctorAgent'],
                  default:'member',
                  required: true},
  cp:           {type: String}, //código postal
  gender:       {type: String,
                  enum : ['Masculino','Femenino'],
                  default : 'Masculino'},
  cellphone:     {type: String},
  //membership:   {type: Schema.Types.ObjectId, ref: 'Membership'}
  membership : {
    memberId :  {type: String},
    startDate : {type: Date },
    expiringDate: {type: Date},
    type :      {type: String,
                  enum: ['A','B','C']},
  },
  residence : {type: String, trim: true, uppercase: true},
  occupation: {type: String,
                enum: ['Estudiante', 'Empleado', 'Empresario',
                       'Desempleado']},
  civilStatus: {type: String,
                enum: ['Soltero','Casado','Unión libre','Divorciado',' Viudo']},
  scholarship: {type: String,
                enum: ['Primaria','Secundaria','Preparatoria',
                        'Licenciatura', 'Posgrado']},
  religion:    {type: String,
                enum: ['Católico','Judío','Ortodoxos','Otro']},
  medicalRecord:  {type: Schema.Types.ObjectId, ref: 'MemberMedicalRecord'}
}, { runSettersOnQuery: true });

//Generar el hashSync
userSchema.methods.generateHash = function(password){
  return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password){
  return bCrypt.compareSync(password, this.password);
};

userSchema.methods.getAccTypes = function(){
  return userSchema.path('accType').enumValues;
};

module.exports = mongoose.model('User', userSchema);
