'use strict'

const auth = require('./middlewares/auth')
const userController = require('./controllers/user');
const memberController = require('./controllers/member');

//Rutas
module.exports = function(app, passport) {

  app.get('/', userController.getAllUsers);
  app.get('/signupMember', (req, res) => {
    res.status(200).render('pages/signupMember', {
      user: req.user
    });
  });
  app.post('/signupMember', memberController.insertMember);

  app.get('/signupUser', (req, res)=> {
    var accTypes = require('./models/user').schema.path('accType').enumValues;
    res.status(200).render('pages/signupUser', {
      user: req.user,
      'accTypes' : accTypes
    });
  });
  app.post('/signupUser', userController.insertUser);

  app.get('/signin', (req, res) => {
    res.status(200).render('pages/signin', {
      message: req.flash('loginMessage'),
      user: req.user
    });
  });
  app.post('/signin', passport.authenticate('local-login', {
    successRedirect: '/loadDashboard',
    failureRedirect: '/signin',
    failureFlash: true
  }));
  //app.post('/signin', userController.signIn);
  app.get('/updateProfile', auth, (req, res) => {
    res.status(200).render('pages/updateProfile', {
      user: req.user
    });
  });
  app.post('/updateProfile', auth, userController.updateProfile);
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/signin');
  });

  app.get('/updateMedicalRecord', auth, (req, res) => {
    res.status(200).render('pages/updateMedicalRecord', {
      user: req.user
    });
  });

  app.post('/updateMedicalRecord', auth, (req, res) => {
    console.log(req.body);
    res.redirect('pages/loadDashboard');
  });

  app.get('/findMembers', (req, res) => {
    res.status(200).render('pages/findMembers', {
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

  app.get('/loadDashboard', auth, (req, res) => {
    var accType = req.user.accType;
    res.status(200).render('dashboards/' + accType, {
      user: req.user
    });
  });
}
