'use strict'
//Modelos
const Doctor = require('../models/doctor')
const User = require('../models/user')
const Membership = require('../models/membership')
//Ruta
const dashRoute = 'dashboards/recepcionist/'
//Enumeraciones
const memberTypes = Membership.schema.path('type').enumValues;



module.exports = {
  //Load functions {Render pages}
  loadSignupMember: (req, res) =>{
    res.status(200).render(`${dashRoute}signupMember`,{
      user: req.user,
      message: '',
      menu: '/signupMember',
      'memberTypes':memberTypes
    });
  }
  //fin Load
}
