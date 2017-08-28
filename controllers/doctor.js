'use strict'
const User = require('../models/user')
const Doctor = require('../models/doctor')
const dashRoute = 'dashboards/doctor/'
//Si está loggeado como doctor
// /addPatient
function loadPatients(req, res) {
  Doctor.findById(req.user.doctorProfile).
  populate({
    path: 'patients',
    model: 'User',
    select: 'fullName cellphone email accType'
  }).
  exec(function(err, doctorProfile) {
    if (err) {
      throw err;
    }
    var renderPage = dashRoute + 'patients';
    var parameters = {}
    //TODO: verificar si la variable patients existe (es obligatoria)
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

//Se manda en el request el memberId
//El doctor está usando su cuenta
function addPatient(req, res) {
  console.log(req.body);
  let user = new User();
  var birthday = req.body.birthday;
  birthday = birthday.split("-");
  var dateFormat = birthday[2] + "-" + birthday[1] + "-" + birthday[0];
  //user.birthday = new Date(dateFormat);
  console.log(user.birthday);
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
  User.findOne({
      'email': user.email
    },
    function(err, userFound) {
      if (err) {
        throw err;
      }
      //Si no hay un usuario con ese correo, lo agregamos al sistema
      if (!userFound) {
        user.save((err) => {
          if (err) {
            throw err;
          }
          //Actualizamos los pacientes del doctor
          Doctor.findByIdAndUpdate(req.user.doctorProfile, {
              "$addToSet": {
                "patients": user._id
              }
            },
            (err, doctorUpdated) => {
              if (err) {
                throw err;
              }
              res.status(200).redirect('/patients');
            });
        });
      } else {
        //Informar que el usuario ya existe
        res.status(403).send("El usuario ya existe");
      }
    });
}

function addPatientByMemberIdToken(req, res) {
  var memberId = req.body.memberId;
  var token = req.body.token;
  console.log(req.body);
  User.findOne({
    'membership.memberId': memberId,
    'verificationCode': token
  }, function(err, patient) {
    if (err) {
      throw err;
    }
    if (patient){
      //Actualizamos los pacientes del doctor
      console.log(patient);
      Doctor.findByIdAndUpdate(req.user.doctorProfile, {
          "$addToSet": {
            "patients": patient._id
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
    select: 'fullName cellphone email'
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

module.exports = {
  loadPatients,
  addPatient,
  sendPatients,
  findPatientByName,
  loadPatientForm,
  addPatientByMemberIdToken
}
