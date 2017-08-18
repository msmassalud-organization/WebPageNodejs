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

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }

  res.redirect('/');
}

module.exports = isLoggedIn
