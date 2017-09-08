'use strict'

const services =  require('../services')

function isAuth(req, res, next){
  if(!req.headers.authorization){
    return res.status(403).send({message: 'No tienes autorización.'})
  }

  const token = req.headers.authorization.split(" ")[1]
  services.decodeToken(token)
  .then(response =>{
    req.user = response;
    next()
  })
  .catch(response =>{
    res.status(response.status).send(response.message);
  });

}
module.exports = {
  //TODO: Indicar acceso prohibido
  isLoggedIn: function(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }

    res.redirect('/signin');
  },

  hasAccessToMembers: function(req, res, next){
    if(req.isAuthenticated){
      switch (req.user.accType) {
        case 'admin':
        case 'recepcionist':
          return next();
        default:
          res.redirect('/signin');
      }
    }
  },

  isAdmin: function(req, res, next){
    if(req.isAuthenticated()){
      if(req.user.accType == 'admin'){
        return next();
      }
    }
    res.redirect('/signin');
  },

  isDoctor: function(req, res, next){
    if(req.isAuthenticated()){
      if(req.user.accType == 'doctor'){
        return next();
      }
    }
    res.redirect('/signin');
  },

  isMember: function(req, res, next){
    if(req.isAuthenticated()){
      if(req.user.accType == 'member'){
        return next();
      }
    }
    res.redirect('/signin');
  },

  isRecepcionist: function(req, res, next){
    if(req.isAuthenticated()){
      if(req.user.accType == 'recepcionist'){
        return next();
      }
    }
    res.redirect('/signin');
  }
}
