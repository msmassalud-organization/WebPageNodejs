'use strict'
//Modelos
const User = require('../models/user')
const Doctor = require('../models/doctor')
const Membership = require('../models/membership')
const Service = require('../models/service')
const ServTypes = require('../models/serviceType')
//Enumeraciones
const accTypes = User.schema.path('accType').enumValues;
const memberTypes = Membership.schema.path('type').enumValues;
const areaTypes = ServTypes.schema.path('area').enumValues;
//Ruta de renderizado
const route = 'dashboards/admin/'
//Files
const fs = require('fs')
const csv = require('express-csv')
//In-class functions (privadas)
function createUser(req) {
  let user = new User();
  user.name = req.body.name;
  user.dadLastName = req.body.dadLastName;
  user.momLastName = req.body.momLastName;
  user.fullName = `${user.name} ${user.dadLastName} ${user.momLastName}`;
  user.email = req.body.email;
  user.password = user.generateHash(req.body.password);
  user.cellphone = req.body.cellphone;
  user.accType = req.body.accType;
  user.registeredBy = req.user._id;
  return user;
}

function insertDoctor(req, res, user) {
  var doctorProfile = new Doctor();
  user.doctorProfile = doctorProfile._id;
  doctorProfile.save((err) => {
    if (err) {
      res.status(500).send(err);
    }
    user.save((err) => {
      if (err) {
        throw err;
      }
      res.status(200).redirect('/dashboard');
    });
  });
}
//FIN In-class
module.exports = {
  //Load Functions {Render Pages}
  loadEditService: function(req, res) {
    ServTypes.find({}).
    select("-id classification").
    exec(function(err, servTypes) {
      if (err) {
        throw err;
      }
      if (servTypes) {
        res.status(200).render(route + 'editService', {
          user: req.user,
          'areaTypes': areaTypes
        });
      } else {
        res.status(200).render(route + 'editService', {
          user: req.user,
          'areaTypes': []
        });
      }
    });
  },

  loadSignupUser: function(req, res) {
    res.status(200).render(`${route}signup`, {
      user: req.user,
      'accTypes': accTypes
    })
  },

  loadSignupMember: function(req, res, next) {
    if(req.user.accType == 'recepcionist'){
      next();
    }
    res.status(200).render(`${route}/signupMember`, {
      user: req.user,
      'memberTypes': memberTypes,
      message: ''
    });
  },

  loadServices: function(req, res) {
    console.log('/loadServices');
    Service.find({}).
    select('-id').
    exec(function(err, services) {
      if (err) {
        throw err;
      }
      if (services) {
        res.status(200).render(route + 'services', {
          user: req.user,
          menu: '/services',
          'services': services
        });
      } else {
        res.status(200).render(route + 'services', {
          user: req.user,
          menu: '/services',
          'services': []
        });
      }
    });
  },

  loadAllUsers: function(req, res) {
    console.log('/loadMembers');
    User.find().exec((err, users) => {
      if (err) {
        throw err;
      }
      if (users) {
        res.status(200).render(`${route}allUsers`, {
          user: req.user,
          'users': users,
          menu: '/loadAllUsers'
        });
      } else {
        res.status(200).render(`${route}allUsers`, {
          user: req.user,
          'users': [],
          menu: '/loadAllUsers'
        });
      }
    });
  },

  loadAllNoMembers: function(req, res) {
    User.find({
      'accType': 'noMember'
    }).populate({
      path: 'registeredBy',
      model: 'User',
      select: 'fullName',
    }).exec((err, noMembers) => {
      if (err) {
        throw err;
      }
      if (noMembers) {
        res.status(200).render(`${route}allNoMembers`, {
          user: req.user,
          'noMembers': noMembers,
          menu: '/loadAllNoMembers'
        });
      } else {
        res.status(200).render(`${route}allNoMembers`, {
          user: req.user,
          'noMembers': noMembers,
          menu: '/loadAllNoMembers'
        });
      }
    });
  },
  //FIN LOAD

  signupUser: function(req, res) {
    //Primero tenemos que asegurar que no exista el usuario
    User.findOne({
        'email': req.body.email
      },
      (err, user) => {
        if (err) {
          res.status(500).render('pages/500', {
            message: err
          });
        } else {
          //Creamos el usuario si no existe
          if (!user) {
            let user = createUser(req);
            if (user.accType == 'doctor') {
              insertDoctor(req, res, user);
            } else {
              user.save((err) => {
                if (err) {
                  res.status(500).render('pages/500', {
                    message: err
                  });
                } else {
                  res.status(200).redirect('/dashboard');
                }
              })
            }
          } else {
            res.status(204).render(`${route}/signup`, {
              user: req.user,
              'accTypes': accTypes,
              message: 'El usuario ya existe.'
            });
          }
        }
      }
    );
  },

  createMemberships: function(req, res) {
    //Obtenemos la ultima membresia insertada
    Membership.findOne({}).
    sort({
      _id: -1
    }).
    limit(1).
    exec((err, membership) => {
      if (err) {
        throw err;
      }
      if(!membership){
        var initId = 0;
      }else{
          console.log(membership.memberId);
          var initId = membership.memberId;
      }

      //Empezaremos a insertar a partir del siguiente

      var arr = [];
      console.log(`Cantidad a insertar: ${req.body.cant}`);
      console.log('Ultimo ID: ' + (parseInt(req.body.cant) + initId));
      for (var i = initId; i < (parseInt(req.body.cant) + initId); i++) {
        var membAux = new Membership();
        membAux.memberId = i + 1;
        arr.push(membAux);
      }
      Membership.insertMany(arr, (err, docs) => {
        if (err) {
          throw err;
        }
        res.status(200).send(`${i}`);
      });

    });
  },

  getServices: function(req, res) {
    Service.find({}).
    select('-id').
    exec(function(err, services) {
      if (err) {
        throw err;
      }
      if (services) {
        res.status(200).send(services);
      } else {
        res.status(404).send([]);
      }
    });
  },

  getServiceByCve: function(req, res) {
    var cve = req.query.CveEstu;
    Service.finOne({
      'CveEstu': cve
    }).
    select('-id').
    exec(function(err, service) {
      if (err) {
        throw err;
      }
      if (service) {
        res.status(200).send(service);
      } else {
        res.status(404).send();
      }

    });
  },
  //Realiza la conversión de la query en un archivo csv
  getMembershipsFile: function(req, res) {
    console.log('/getMembershipsFile');
    res.setHeader('Content-disposition', 'attachment; filename=memberships.csv');
    res.setHeader('Content-type', 'text/csv');
    Membership.find({}).
    select('-_id memberId verificationCode').
    sort('memberId').
    exec((err,memberships)=>{
        if(err){
          throw err;
        }
    }).then(function(docs){
      Membership.csvReadStream(docs)
      .pipe(res);
    });

  }
} //FIN EXPORTS
