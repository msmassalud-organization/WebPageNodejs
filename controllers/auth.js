'use strict'

const mongoose = require('mongoose')
const User = require('../models/user')
const service = require('../services/index')

function signUp(req, res) {

}

function signIn(req, res) {
  User.findOne({ email: req.body.email },
    (err, user) =>{
      if(err){
        return res.status(500).send(message: err);
      }

      if(!user){
        return res.status(404).send(message: 'No existe el usuario');
      }

      req.user = user;
      res.status(200).send({
        message: 'Te has loggeado correctamente',
        token: service.createToken(user)
      })
    });
}

module.exports = {
  signUp,
  signIn
}
