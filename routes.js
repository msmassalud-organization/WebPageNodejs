'use strict'

const auth = require('./middlewares/auth')
const userController = require('./controllers/user');

module.exports = function(app, passport) {
  //Rutas

  app.get('/', userController.getAllUsers);
  app.get('/signupMember', (req, res) => {
    res.status(200).render('pages/signupMember', {
      user: req.user });
  });
  app.post('/signupMember', userController.insertMember);
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

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/signin');
  });

  app.get('/findMembers', (req, res) => {
    res.status(200).render('pages/findMembers', {
      user: req.user
    });
  });
  app.get('/getMembersByName', userController.getMembersByName);
  app.post('/loadProfile', userController.loadMemberProfile);
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
