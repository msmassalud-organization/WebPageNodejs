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
  loadCalendar: (req, res) =>{
    //Buscamos a todos los doctores para ofrecer un listado
    User.find({
      'accType':'doctor'
    }).sort('dadLastName').populate({
      path:'doctorProfile',
      model:'Doctor',
      populate:{
        path:'agenda',
        model:'Event',
      }
    }).exec((err, doctors)=>{
      if(err){
        //TODO: enviar error 500
        throw err;
      }
      if(doctors){
        res.status(200).render(`${dashRoute}calendar`,{
          user: req.user,
          menu: '/calendar',
          'doctors':doctors
        });
      }
    });
  }
  //fin Load
}
