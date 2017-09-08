'use strict'

const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const SystemEvent = require('../models/systemEvent')
const SEC = require('../controllers/systemEvent')

//Cadenas para los eventos del sistema
const LOGIN = 'LOGIN';

module.exports = function(passport) {

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  //passport.use('local-signup')

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true

  }, function(req, email, password, done){
    console.log(req.body);
    process.nextTick(()=>{
      User.findOne({'email': email}, function(err, user){
        if(err){
          return done(err);
        }
        if(!user){
          return done(null, false, req.flash('loginMessage','No se encontró el usuario'));
        }

        if(!user.validPassword(password)){
          return done(null, false, req.flash('loginMessage', 'Contraeña incorrecta!'));
        }
        let systemEvent = new SystemEvent();
        systemEvent.description = SEC.getEventDescription(LOGIN, user);
        systemEvent.performedBy = user._id;
        systemEvent.save((err)=>{
          if(err){
            throw err;
          }
          return done(null, user);
        });
      });
    });

  }));

}
