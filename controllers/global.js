'use strict'
//Modelos
const Membership = require('../models/membership')
const MR = require('../models/medicalRecord')
const User = require('../models/user')
const NAC_CATALOG = require('../models/nac_catalog')
//Enumeraciones
const memberTypes = Membership.schema.path('type').enumValues;
const traumaAreasE = MR.schema.path('pathological.Trauma.physicalTraumaAreas').options.enum;
const hospitalizationTypeE = MR.schema.path('pathological.Hospitalizations.hospitalizationType').options.enum;
const allergiesE = MR.schema.path('pathological.Hospitalizations.allergies').options.enum;
const infectoTypeE = MR.schema.path('pathological.Diseases.infectoType').options.enum;
const lungTypeE = MR.schema.path('pathological.Diseases.lungType').options.enum;
const kidneyTypeE = MR.schema.path('pathological.Diseases.kidneyType').options.enum;
const liverTypeE = MR.schema.path('pathological.Diseases.liverType').options.enum;
const cerebralPalsyE = MR.schema.path('pathological.Diseases.cerebralPalsy').options.enum;
const diabetesTypeE = MR.schema.path('pathological.Diseases.diabetesType').options.enum;
const hearthTypeE = MR.schema.path('pathological.Diseases.hearthType').options.enum;
const cancerTypeE = MR.schema.path('pathological.Diseases.cancerType').options.enum;
/**
  Para funciones que requieren de la misma dirección pero no queremos que todos
  tengan acceso. Por ejemplo: /signupMember es algo que pueden realizar diferentes
  tipos de cuenta, por lo tanto, para no crear direcciones como: /signupMember{A,B,C}
  mejor tratamos los accesos de manera independiente
*/

module.exports = {
  //De momento solo 'admin' y 'recepcionist' puedan registrar usuarios
  loadSignupMember: (req, res) => {
    //Simplemente debemos modificar la ruta de redirección a la página de registro
    //la ruta está creada a partir de: dashboards/<accType>/signupMember
    var accType = req.user.accType;
    switch (accType) {
      case 'admin':
      case 'recepcionist':
        NAC_CATALOG.find({}, (err, catalog)=>{
          if(err){
            throw err;
          }

          if(catalog){
            res.status(200).render(`pages/signupMember`, {
              user: req.user,
              message: '',
              'memberTypes': memberTypes,
              'nac_catalog': catalog
            });
          }
        });

        break;
      default:
        //Si no es el tipo que está permitido, redireccionamos a signin
        res.status(403).redirect('/signin');
    }
  },

  loadAllMembers: (req, res) => {
    console.log('/loadAllMembers');
    Membership.find({
      'isActive': true
    }).
    populate({
      path: 'userProfile',
      model: 'User',
      select: '-id -helpedBy'
    }).exec((err, memberships) => {
      if (err) {
        throw err;
      }
      var route = `dashboards/${req.user.accType}/`
      if (memberships) {
        res.status(200).render(`${route}allMembers`, {
          user: req.user,
          'memberships': memberships,
          menu: '/loadAllMembers'
        });
      } else {
        res.status(200).render(`${route}allMembers`, {
          user: req.user,
          'memberships': [],
          menu: '/loadAllMembers'
        });
      }
    });
  },

  loadProfile: (req, res) => {
    var accType = req.user.accType;
    var route = `dashboards/${accType}/profile`;
    res.status(200).render(route, {
      user: req.user,
      menu: req.route.path
    });
  },

  loadDashboard: (req, res) => {
    var accType = req.user.accType;
    var route = `dashboards/${accType}/index`;
    res.status(200).render(route, {
      user: req.user,
      menu: req.route.path
    });
  },

  loadMedicalRecord: (req, res) => {
    var accType = req.user.accType;
    var email = req.query.email;
    //Quienes no queremos que tengan acceso
    if (accType != 'member' && accType != 'default') {
      //Buscamos al usuario que acabamos de registrar
      User.findOne({
        'email': email
      }).populate({
        path: 'medicalRecord',
        model: 'MemberMedicalRecord',
        select: '-_id'
      }).exec((err, member) => {
        if (err) {
          throw err;
        }
        //si existe el usuario (debería)
        if (member) {
          //Renderizamos la página para la captura de la historia clínica
          res.status(200).render('pages/medicalRecord', {
            'user': req.user,
            menu: '/medicalRecord',
            'member': member,
            message: '',
            'physicalTraumaAreas': traumaAreasE,
            'hospitalizationType':hospitalizationTypeE,
            'allergies':allergiesE,
            'infectoType':infectoTypeE,
            'kidneyType':kidneyTypeE,
            'liverType':liverTypeE,
            'cerebralPalsy':cerebralPalsyE,
            'diabetesType':diabetesTypeE,
            'hearthType':hearthTypeE,
            'cancerType':cancerTypeE,
            'lungType':lungTypeE,
          });
        }
      });
    }
  },

  updateProfile: (req, res) => {
    console.log(req.body);
    var update = req.body;
    res.send(req.body);
    //TODO
    /*
    User.findByIdAndUpdate(req.user._id, update, function(err, userUpdated) {
      if (err) {
        res.status(500).send(err);
      }
      console.log(userUpdated);
      res.status(200).redirect("/loadDashboard");
    });*/
  }

} //Fin Exports
