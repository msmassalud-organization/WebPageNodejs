'use strict'
//Modelos
const Membership = require('../models/membership')
//Enumeraciones
const memberTypes = Membership.schema.path('type').enumValues;
/**
  Para funciones que requieren de la misma dirección pero no queremos que todos
  tengan acceso. Por ejemplo: /signupMember es algo que pueden realizar diferentes
  tipos de cuenta, por lo tanto, para no crear direcciones como: /signupMember{A,B,C}
  mejor tratamos los accesos de manera independiente
*/

module.exports = {
  //De momento solo 'admin' y 'recepcionist' puedan registrar usuarios
  loadSignupMember: (req, res)=>{
    //Simplemente debemos modificar la ruta de redirección a la página de registro
    //la ruta está creada a partir de: dashboards/<accType>/signupMember
    var accType = req.user.accType;
    switch (accType) {
      case 'admin':
      case 'recepcionist':
        res.status(200).render(`dashboards/${accType}/signupMember`,{
          user: req.user,
          message: '',
          'memberTypes':memberTypes
        })
        break;
      default:
        //Si no es el tipo que está permitido, redireccionamos a signin
        res.status(403).redirect('/signin');
    }
  },

  loadAllMembers: (req, res) =>{
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

  loadProfile: (req, res) =>{
    var accType = req.user.accType;
    var route = `dashboards/${accType}/profile`;
    res.status(200).render(route, {
      user: req.user,
      menu: req.route.path
    });
  },

  loadDashboard: (req,res)=>{
    var accType = req.user.accType;
    var route = `dashboards/${accType}/index`;
    res.status(200).render(route, {
      user: req.user,
      menu: req.route.path
    });
  }

}//Fin Exports
