'use strict'

const auth = require('./middlewares/auth')
const userController = require('./controllers/user');

module.exports = function(app, passport){
  //Rutas

  app.get('/', userController.getAllUsers);
  app.get('/signupMember', (req, res) =>{
    res.status(200).render('pages/signupMember');
  });
  app.post('/signupMember', userController.insertMember);
  app.get('/signin', (req, res) =>{
    res.status(200).render('pages/signin', {message : ""});
  });
  app.post('/signin', passport.authenticate('local-login',{
    successRedirect: '/loadDashboard',
    failureRedirect: '/signin',
    failureFlash: true
  }));

  app.get('/findMembers', (req, res) =>{
    res.status(200).render('pages/findMembers');
  });
  app.get('/getMembersByName', userController.getMembersByName);
  app.post('/loadProfile', userController.loadMemberProfile);
  app.get('/loadProfile', (req, res) =>{
    res.status(403).render('pages/403');
  });

  app.get('/loadDashboard', auth, (req, res)=>{
    var accType = req.user.accType;
    res.status(200).render('dashboards/'+accType,{
      user: req.user
    });
  });

  app.get('/private', auth,(req, res)=>{
    res.status(200).send({message: 'Tienes acceso.'});
  });
}
