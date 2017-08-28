'use strict'

const auth = require('./middlewares/auth')
const userController = require('./controllers/user');
const memberController = require('./controllers/member');
const MRController = require('./controllers/medicalRecord');
const doctorController = require('./controllers/doctor');
const adminController = require('./controllers/admin');

//Rutas
module.exports = function(app, passport) {
  //Raiz
  //app.get('/', userController.getAllUsers);
  app.get('/', (req, res, next) => {
    //Actualiza vistas
    req.session.views = (req.session.views || 0) + 1;
    //Manda la respuesta
    res.end(req.session.views + ' views');
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
  //Fin User

  //Miembros
//  app.get('/signupMember', memberController.loadSignupMember);
  app.post('/signupMember', memberController.insertMember);
  app.get('/isMember', auth.isLoggedIn, memberController.isMember);
  app.post('/verifyToken',auth.isLoggedIn, memberController.verifyToken);
  app.get('/findMembers', auth.isLoggedIn, (req, res) => {
    res.status(200).render('pages/findMembers',{
      user: req.user
    });
  });
  app.get('/getMembersByName', memberController.getMembersByName);
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

  //Administrador
  app.get('/signupMember', auth.isAdmin, adminController.loadSignupMember);
  app.get('/signupUser', auth.isAdmin, adminController.loadSignupUser);
  app.post('/signupUser', auth.isAdmin, adminController.signupUser);
  app.post('/createMemberships', auth.isAdmin, adminController.createMemberships);
  //Fin Administrador


  app.get('/loadDashboard', auth.isLoggedIn, (req, res) => {
    var accType = req.user.accType;
    res.status(200).render('dashboards/' + accType, {
      user: req.user
    });
  });

  //Dashboard
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
//Fin Dashboard
