'use strict'

const auth = require('./middlewares/auth')
const userController = require('./controllers/user');
const memberController = require('./controllers/member');
const MRController = require('./controllers/medicalRecord');
const doctorController = require('./controllers/doctor');
const adminController = require('./controllers/admin');
const recepcionistController = require('./controllers/recepcionist')
const globalController = require('./controllers/global')

//TEST
const testController = require('./testControllers/test')
//Rutas
module.exports = function(app, passport) {
  //Raiz
  app.get('/', (req, res, next) => {
    res.status(200).redirect('/signin');
  })

  // User
  app.get('/signin', (req, res) => {
    res.status(200).render('pages/signin', {
      message: req.flash('loginMessage'),
      user: req.user
    });
  });
  app.post('/signin', passport.authenticate('local-login', {
    successRedirect: '/dashboard',
    failureRedirect: '/signin',
    failureFlash: true
  }));
  app.get('/logout', userController.logOut);
  //Fin User

  //Miembros
  app.get('/isMember', auth.isLoggedIn, memberController.isMember);
  app.get('/getMembersByName', memberController.getMembersByName);
  app.post('/signupMember', memberController.signupMember);
  app.post('/verifyToken', auth.isLoggedIn, memberController.verifyToken);
  //Fin Miembros

  //Expediente Médico
  app.get('/updateMedicalRecord', auth.isLoggedIn, MRController.loadMedicalRecord);
  app.post('/updateMedicalRecord', MRController.update);
  //Fin Expediente Médico

  //Dashboard del doctor
  app.get('/patients', auth.isDoctor, doctorController.loadPatients);
  app.get('/findPatientByName', auth.isDoctor, doctorController.findPatientByName);
  app.get('/createPatient', auth.isDoctor, doctorController.loadPatientForm);
  app.get('/loadPatientProfile', auth.isDoctor, doctorController.loadPatientProfile);
  app.get('/doctorCalendar', auth.isDoctor, doctorController.loadCalendar);
  app.get('/myServices', auth.isDoctor, doctorController.loadServices);
  app.get('/getDoctorEvents', auth.isDoctor, doctorController.getEvents);
  app.post('/addPatient', auth.isDoctor, doctorController.addPatient);
  app.post('/getMyPatients', auth.isDoctor, doctorController.sendPatients);
  app.post('/addPatientByMemberIdToken', auth.isDoctor, doctorController.addPatientByMemberIdToken);
  app.post('/deletePatient', auth.isDoctor, doctorController.deletePatient);
  app.post('/registerEvent', auth.isDoctor, doctorController.registerEvent);
  //Fin Dashboard

  //Administrador
  app.get('/signupUser', auth.isAdmin, adminController.loadSignupUser);
  app.get('/services', auth.isAdmin, adminController.loadServices);
  app.get('/loadAllUsers', auth.isAdmin, adminController.loadAllUsers);
  app.get('/loadAllNoMembers', auth.isAdmin, adminController.loadAllNoMembers);
  app.get('/getMembershipsFile', auth.isAdmin, adminController.getMembershipsFile);
  app.post('/signupUser', auth.isAdmin, adminController.signupUser);
  app.post('/createMemberships', auth.isAdmin, adminController.createMemberships);
  app.post('/getServices', auth.isAdmin, adminController.getServices);
  //Fin Administrador

  //Globales
  app.get('/signupMember', auth.isLoggedIn,  globalController.loadSignupMember);
  app.get('/loadAllMembers', auth.hasAccessToMembers, globalController.loadAllMembers);
  app.get('/dashboard', auth.isLoggedIn, globalController.loadDashboard);
  app.get('/profile', auth.isLoggedIn, globalController.loadProfile);
  app.get('/medicalRecord', auth.isLoggedIn, globalController.loadMedicalRecord);

  app.post('/updateProfile', auth.isLoggedIn, globalController.updateProfile);
  //Fin globales

  //Recepcionista
  //app.get('/signupMember', auth.isRecepcionist, recepcionistController.loadSignupMember);
  //Fin Recepcionista

  //TEST ONLY
  app.post('/test', testController.test);
  app.post('/testTwilio', testController.twilioTest);
  app.get('/test', testController.loadTest);

}
//Fin Dashboard
