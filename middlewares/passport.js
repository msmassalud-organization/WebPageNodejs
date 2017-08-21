'use strict'

const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');


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
    console.log("Finding USER");
    process.nextTick(()=>{
      User.findOne({'email': email}, function(err, user){
        if(err){
          return done(err);
        }
        console.log("QUERY EXECUTED");
        if(!user){
          console.log("USER NOT FOUND");
          return done(null, false, req.flash('loginMessage','No se encontró el usuario'));
        }

        if(!user.validPassword(password)){
          console.log("PASSWORD INCORRECT");
          return done(null, false, req.flash('loginMessage', 'Contraeña incorrecta!'));
        }
        console.log("RETURNING USER");
        return done(null, user);
      });
    });

  }));

}
