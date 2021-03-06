'use strict'
const User = require('../models/user')
const Doctor = require('../models/doctor')
const Membership = require('../models/membership')
const MR = require('../models/medicalRecord')
const Event = require('../models/event')
const dashRoute = 'dashboards/doctor/'

//Private functions
function createPatient(req, res) {
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

//Creación del objeto Evento
function createEvent(req) {
  let _event = new Event();
  console.log(_event);
  console.log(new Date(req.body.start));
  console.log(new Date(req.body.end));
  _event.calendar.title = req.body.title;
  _event.calendar.start = new Date(req.body.start);
  _event.calendar.end = new Date(req.body.end);
  _event.doctor = req.user._id;
  return _event;
}
//Fin private

module.exports = {
  //Load functions {Render pages}
  loadPatients: (req, res)=> {
    Doctor.findById(req.user.doctorProfile).
    populate({
      path: 'patients',
      model: 'User',
      select: 'fullName cellphone email accType membership',
      populate: {
        path: 'membership',
        model: 'Membership',
        select: 'memberId'
      }
    }).
    exec((err, doctorProfile) => {
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
  },

  loadServices: (req, res)=> {
    res.status(200).render(dashRoute + 'services', {
      user: req.user,
      menu: '/myServices'
    });
  },

  loadCalendar: (req, res)=> {
    console.log('/doctorCalendar');
    res.status(200).render(dashRoute + 'calendar', {
      user: req.user,
      menu: '/doctorCalendar',
      fecha: Date.now()
    });
  },

  loadPatientForm: (req, res)=> {
    res.status(200).render(dashRoute + 'signupPatient', {
      user: req.user,
      menu: '/patients'
    });
  },

  loadPatientProfile: (req, res)=> {
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
    exec((err, patient) => {
      if (err) {
        throw err;
      }
      if(patient){
        res.status(200).render(`${dashRoute}patientProfile`,{
          user: req.user,
          menu: "/loadPatientProfile",
          'patient': patient
        });
      }else{
        //TODO: 404
        res.status(404).send('Error 404: Not found!');
      }
    });
  },
  //Fin LOAD

  //Se manda en el request el memberId
  //El doctor está usando su cuenta
  addPatient: (req, res)=> {
    User.findOne({
        'email': req.body.email
      },
      (err, userFound) => {
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
  },

  addPatientByMemberIdToken: (req, res)=> {
    var memberId = req.body.memberId;
    var token = req.body.token;
    console.log(req.body);

    Membership.findOne({
      'memberId': memberId,
      'verificationCode': token
    }, (err, membership) => {
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
  },

  //Envía pacientes cuando se hace la petición por ajax.
  //Como el doctor está loggeado, se utiliza su id para
  //obtener la información.
  sendPatients: (req, res)=> {
    Doctor.findById(req.user.doctorProfile).
    populate({
      path: 'patients',
      model: 'User',
      select: 'fullName cellphone email membership'
    }).
    exec((err, doctorProfile) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).send(doctorProfile.patients);
    });
  },

  findPatientByName: (req, res)=> {
    var toFind = req.query.name;
    Doctor.findById(req.user.doctorProfile).
    populate({
      path: 'patients',
      model: 'User',
      select: 'fullName cellphone email -_id',
      fullName: new RegExp(toFind)
    }).
    exec((err, doctorProfile) => {
      if (err) {
        res.status(500).send(err);
      }
      var patientsToSend = [];
      doctorProfile.patients.forEach((patient) => {
        if (new RegExp(toFind).test(patient.fullName)) {
          patientsToSend.push(patient);
        }
      });
      res.status(200).send(patientsToSend);
    });
  },

  deletePatient: (req, res)=> {
    console.log('/deletePatient');
    //TODO: hacer update a isActive: false
    User.findOne({
      email: req.body.email
    }, (err, patient) => {
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
        }, (err, doctorUpdated) => {
          if (err) {
            throw err;
          }
          res.status(200).redirect('/patients');
        });
      }
    });
  },

  /**
    Function: getEvents.
    Obtenemos el arreglo perteneciente a la agenda
    del doctor. Cada elemento del arreglo contiene
    un objeto para mostrar en el calendario. Se crea
    un arreglo por cada objeto y es el que se envía y
    muestra en el Dashboard del doctor.

    Ej. de los parametros de la colección:
    doctor : {
      agenda: [Event]
    }
    event: {
      calendar : {
        start: <Date>,
        end: <Date>
      }
    }
  */
  getEvents: (req, res)=> {
    console.log('/getEvents');
    Doctor.findById(req.user.doctorProfile).
    populate({
      path: 'agenda',
      model: 'Event',
      select: '-id'
    }).exec((err, doctor) => {
      if (err) {
        throw err;
      }

      if (doctor) {
        console.log(`${doctor}`);
        var events = [];
        doctor.agenda.forEach((event) => {
          events.push(event.calendar);
        });
        console.log(events);
        res.status(200).send(events);
      }
    });
  },

  registerEvent: (req, res)=> {
    console.log('/registerEvent');
    console.log(req.body);
    //Creamos el evento
    let _event = createEvent(req);
    //Registramos el evento en la base de datos
    _event.save((err) => {
      if (err) {
        throw err;
      }
      //Agregamos el evento al doctor
      Doctor.findByIdAndUpdate(req.user.doctorProfile, {
        '$addToSet': {
          agenda: _event._id
        }
      }, function(err, doctorUpdated) {
        if (err) {
          console.log(error.errors['doctors'].message);
          throw err;
        }
        res.status(200).redirect('/dashboard');
      });
    })
  },

  getEventsByEmail: (req, res)=>{
    let email = req.query.email;
    User.findOne({
      'email': email,
      'accType':'doctor'
    }).select('-_id doctorProfile').populate({
      path:'doctorProfile',
      model:'Doctor',
      select:'-_id agenda',
      populate: {
        path: 'agenda',
        model: 'Event',
        select: '-_id calendar'
      }
    }).exec((err, agenda)=>{
      if(err){
        //TODO: error 500
        throw err;
      }

      if(agenda){
        res.status(200).send(agenda);
      }else{
        res.status(404).send("La agenda está vacia");
      }
    })
  }

}
