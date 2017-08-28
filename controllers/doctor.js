'use strict'
const User = require('../models/user')
const Doctor = require('../models/doctor')
const Membership = require('../models/membership')
const MR = require('../models/medicalRecord')
const dashRoute = 'dashboards/doctor/'
//Si está loggeado como doctor
// /addPatient
function loadPatients(req, res) {
  Doctor.findById(req.user.doctorProfile).
  populate({
    path: 'patients',
    model: 'User',
    select: 'password fullName cellphone email accType membership',
    populate: {
      path: 'membership',
      model: 'Membership',
      select: 'memberId'
    }
  }).
  exec(function(err, doctorProfile) {
    if (err) {
      throw err;
    }
    var renderPage = dashRoute + 'patients';
    var parameters = {}
    if (doctorProfile.patients.length > 0) {
      parameters = {
        user: req.user,
        patients: doctorProfile.patients,
        menu: req.route.path
      };
    } else {
      parameters = {
        user: req.user,
        message: "Aún no tienes pacientes",
        menu: req.route.path
      };
    }
    res.status(200).render(renderPage, parameters);
  });
}

function createPatient(req, res){
  let user = new User();
  var birthday = req.body.birthday;
  birthday = birthday.split("-");
  var dateFormat = birthday[2] + "-" + birthday[1] + "-" + birthday[0];
  user.birthday = new Date(dateFormat);
  user.name = req.body.name;
  user.dadLastName = req.body.dadLastName;
  user.momLastName = req.body.momLastName;
  user.email = req.body.email;
  user.cellphone = req.body.cellphone;
  user.address = req.body.address;
  user.city = req.body.city;
  user.cp = req.body.cp;
  //user.birthday = req.body.birthday;
  user.password = user.generateHash(user.email);
  user.fullName = `${user.name} ${user.dadLastName} ${user.momLastName}`;
  user.accType = 'noMember';

  return user;
}

//Se manda en el request el memberId
//El doctor está usando su cuenta
function addPatient(req, res) {
  User.findOne({
      'email': req.body.email
    },
    function(err, userFound) {
      if (err) {
        throw err;
      }
      //Si no hay un usuario con ese correo, lo agregamos al sistema
      if (!userFound) {
        let user = createPatient(req, res);
        //Creamos el expediente médico
        let mr = new MR();
        user.medicalRecord = mr._id;
        //Guardamos el expediente
        mr.save((err) => {
          if (err) {
            throw err;
          }
          //Guardamos al usuario
          user.save((err) => {
            if (err) {
              throw err;
            }
          });
        });
      } else {
        //TODO: Informar que el usuario ya existe, o agregarlo directamente
        //Actualizamos los pacientes del doctor
        Doctor.findByIdAndUpdate(req.user.doctorProfile, {
            "$addToSet": {
              "patients": userFound._id
            }
          },
          (err, doctorUpdated) => {
            if (err) {
              throw err;
            }
            res.status(200).redirect('/patients');
          });
      }
    });
}

function addPatientByMemberIdToken(req, res) {
  var memberId = req.body.memberId;
  var token = req.body.token;
  console.log(req.body);

  Membership.findOne({
    'memberId': memberId,
    'verificationCode': token
  }, function(err, membership) {
    if (err) {
      throw err;
    }
    //Si coincide el token con la membresía
    if (membership) {
      //Actualizamos los pacientes del doctor
      Doctor.findByIdAndUpdate(req.user.doctorProfile, {
          "$addToSet": {
            "patients": membership.userProfile
          }
        },
        (err, doctorUpdated) => {
          if (err) {
            throw err;
          }
          console.log(doctorUpdated);
          res.status(200).redirect('/patients');
        });
    }
  });
}

//Envía pacientes cuando se hace la petición por ajax.
//Como el doctor está loggeado, se utiliza su id para
//obtener la información.
function sendPatients(req, res) {
  Doctor.findById(req.user.doctorProfile).
  populate({
    path: 'patients',
    model: 'User',
    select: 'fullName cellphone email membership'
  }).
  exec(function(err, doctorProfile) {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).send(doctorProfile.patients);
  });
}

function findPatientByName(req, res) {
  var toFind = req.query.name;
  Doctor.findById(req.user.doctorProfile).
  populate({
    path: 'patients',
    model: 'User',
    select: 'fullName cellphone email -_id',
    fullName: new RegExp(toFind)
  }).
  exec(function(err, doctorProfile) {
    if (err) {
      res.status(500).send(err);
    }
    var patientsToSend = [];
    doctorProfile.patients.forEach(function(patient) {
      if (new RegExp(toFind).test(patient.fullName)) {
        patientsToSend.push(patient);
      }
    });
    res.status(200).send(patientsToSend);
  });
}

function loadPatientForm(req, res) {
  res.status(200).render(dashRoute + 'signupPatient', {
    user: req.user,
    menu: '/patients'
  });
}

function loadPatientProfile(req, res) {
  console.log('/loadPatientProfile');
  console.log(req.query.email);
  User.findOne({
    email: req.query.email
  }, '-id').
  populate({
    path: 'medicalRecord',
    model: 'MemberMedicalRecord',
    select: '-id'
  }).
  exec(function(err, patient) {
    if (err) {
      throw err;
    }
    console.log(patient);
    res.status(200).send(patient);
  });
}

function deletePatient(req, res) {
  console.log('/deletePatient');
  //TODO: hacer update a isActive: false
  User.findOne({
    email: req.body.email
  }, function(err, patient) {
    if (err) {
      throw err;
    }
    //Si el usuario existe (que debería...)
    if (patient) {
      console.log("Paciente encontrado");
      //Lo eliminamos de la base de datos del doctor
      Doctor.findByIdAndUpdate(req.user.doctorProfile, {
        '$pull': {
          patients: patient._id
        }
      }, function(err, doctorUpdated) {
        if (err) {
          throw err;
        }
        res.status(200).redirect('/patients');
      });
    }
  });
}

module.exports = {
  loadPatients,
  addPatient,
  sendPatients,
  findPatientByName,
  loadPatientForm,
  addPatientByMemberIdToken,
  loadPatientProfile,
  deletePatient
}
