'use strict'

const auth = require('./middlewares/auth')
const userController = require('./controllers/user');
const memberController = require('./controllers/member');
const MRController = require('./controllers/medicalRecord');
const doctorController = require('./controllers/doctor');
//Rutas
module.exports = function(app, passport) {

  app.get('/', userController.getAllUsers);
  // User
  app.get('/signupMember', (req, res) => {
    res.status(200).render('pages/signupMember', {
      user: req.user
    });
  });
  app.post('/signupUser', userController.insertUser);
  app.get('/signin', (req, res) => {
    res.status(200).render('pages/signin', {
      message: req.flash('loginMessage'),
      user: req.user
    });
  });
  app.get('/signupUser', (req, res)=> {
    var accTypes = require('./models/user').schema.path('accType').enumValues;
    res.status(200).render('pages/signupUser', {
      user: req.user,
      'accTypes' : accTypes
    });
  });
  app.post('/signin', passport.authenticate('local-login', {
    successRedirect: '/loadDashboard',
    failureRedirect: '/signin',
    failureFlash: true
  }));
  //Fin User

  //Miembros
  app.post('/signupMember', memberController.insertMember);
  app.get('/isMember', auth.isLoggedIn, memberController.isMember);
  app.post('/verifyToken',auth.isLoggedIn, memberController.verifyToken);
  //Fin Miembros



  //app.post('/signin', userController.signIn);
  app.get('/updateProfile', auth.isLoggedIn, (req, res) => {
    res.status(200).render('pages/updateProfile', {
      user: req.user
    });
  });
  app.post('/updateProfile', auth.isLoggedIn, userController.updateProfile);
  app.post('/loadTestDashboard/updateProfile', auth.isLoggedIn, userController.updateProfile);
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/signin');
  });

//Expediente Médico
  app.get('/updateMedicalRecord', auth.isLoggedIn, (req, res) => {
    if(!req.user.medicalRecord){
      //Crear expediente médico
      MRController.insert(req, res);
    }else{
      //nadita nanais
      res.status(200).render('pages/updateMedicalRecord', {
        user: req.user
      });
    }
  });

  app.post('/updateMedicalRecord', auth.isLoggedIn, MRController.update);
  //Fin Expediente Médico

  //Dashboard del doctor
  app.get('/patients', auth.isDoctor, doctorController.loadPatients);
  app.post('/addPatient', auth.isDoctor, doctorController.addPatient);
  app.post('/getMyPatients', auth.isDoctor, doctorController.sendPatients);
  app.get('/findPatientByName', auth.isDoctor, doctorController.findPatientByName);
  app.get('/createPatient', auth.isDoctor, doctorController.loadPatientForm);
  app.post('/addPatientByMemberIdToken', auth.isDoctor, doctorController.addPatientByMemberIdToken);
  //Fin Dashboard

  app.get('/findMembers', auth.isLoggedIn, (req, res) => {
    res.status(200).render('pages/findMembers',{
      user: req.user
    });
  });
  app.get('/getMembersByName', memberController.getMembersByName);
  app.post('/loadProfile', memberController.loadMemberProfile);
  app.get('/loadProfile', (req, res) => {
    res.status(403).render('pages/403', {
      user: req.user
    });
  });

  app.get('/loadDashboard', auth.isLoggedIn, (req, res) => {
    var accType = req.user.accType;
    res.status(200).render('dashboards/' + accType, {
      user: req.user
    });
  });

  app.get('/dashboard', auth.isLoggedIn, (req, res) => {
    var accType = req.user.accType;
    var route = `dashboards/${accType}/index`;
    res.status(200).render(route, {
      user: req.user,
      menu: req.route.path
    });
  });

  app.get('/profile', auth.isLoggedIn, (req, res) => {
    var accType = req.user.accType;
    var route = `dashboards/${accType}/profile`;
    res.status(200).render(route, {
      user: req.user,
      menu: req.route.path
    });
  });
}
