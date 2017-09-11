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
const bloodTypeE = MR.schema.path('pathological.Hospitalizations.bloodType').options.enum;

//Constantes
const expiringTime = 365; //days

//Privadas
function pad(num, size) {
    var s = "0000" + num;
    return s.substr(s.length-size);
}

function createMember(req) {
  let member = new User();
  var birthday = req.body.birthday;
  /*var dateFields = birthday.split("/");
  var day = dateFields[0];
  var month = dateFields[1];
  var year = dateFields[2];*/
  var day = birthday.substring(birthday.length - 2, birthday.length);
  var month = birthday.substring(4, 6);
  var year = birthday.substring(0, 4);
  //ATRIBUTOS SEGUN LA NOM
  member.name = req.body.name;
  member.dadLastName = req.body.dadLastName;
  member.momLastName = req.body.momLastName;
  member.nac_origen = req.body.nac_origen;
  member.edo_nac = pad(req.body.edo_nac, 2);
  member.municipio = pad(req.body.mun, 3);
  member.localidad = pad(req.body.loc, 4);
  member.residence = pad(req.body.residence, 2);
  member.curp = req.body.curp;
  member.gender = req.body.gender;
  member.folio = member.curp;
  member.fecnac = birthday;
  //FIN NOM

  member.fullName = `${member.name} ${member.dadLastName} ${member.momLastName}`;
  member.email = req.body.email;
  member.cp = req.body.cp;
  member.cellphone = req.body.cellphone;
  member.birthday = new Date(year, month, day);


  console.log(member);
  return member;
}

function createMembership(req, res, member, resRoute) {

  //Primero debemos revisar que la membresía no esté ocupada
  Membership.findOne({
    'memberId': req.body.memberId
  }, (err, membership) => {
    if (err) {
      throw err;
    }
    //Si la membresía existe
    if (membership) {
      //Si la membresía no está ligada a un usuario, se liga y se actualiza
      if (!membership.userProfile) {
        member.membership = membership._id;
        membership.type = req.body.type;
        membership.userProfile = member._id;
        membership.startDate = Date.now();
        membership.expiringDate = Date.now();
        membership.expiringDate.setTime(
          membership.expiringDate.getTime() + expiringTime * 86400000);
        membership.folio = req.body.folio;
        //Creamos el expediente médico
        let mr = new MR();
        member.medicalRecord = mr._id;
        //Verificamos si hay alguien ayudando al usuario
        if (req.user) {
          membership.helpedBy = req.user._id;
        }
        //Asignamos la contraseña al usuario: token
        member.password = member.generateHash(membership.verificationCode);
        //Guardamos el expediente médico
        mr.save((err) => {
          //Guardamos primero al usuario
          member.save((err) => {
            if (err) {
              //TODO: Mandar error 500
              throw err;
            }
            //Actualizamos la membresía
            membership.isActive = true;
            membership.save((err, membershipUpdated) => {
              if (err) {
                //TODO: Mandar error 500
                throw err;
              }
              //Mostrar información del miembro: Id, email, contraseña
              var accType = req.user.accType;
              res.status(200).render(`pages/newMemberInfo`, {
                user: req.user,
                'membership': membership,
                'member': member
              });
            });
          });
        });
      } else {
        //La membresía está ocupada
        res.status(404).render(resRoute, {
          user: req.user,
          message: 'Esa membresía ya está ocupada.',
          'memberTypes': memberTypes,
          data: req.body
        });
      }
    } else {
      //Esa membresía es incorrecta y se debe notificar
      res.status(404).render(resRoute, {
        user: req.user,
        message: 'Membresía no encontrada.',
        'memberTypes': memberTypes,
        data: req.body
      });
    }
  });
}



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
        res.status(200).render(`pages/signupMember`, {
          user: req.user,
          message: '',
          'memberTypes': memberTypes
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
            'hospitalizationType': hospitalizationTypeE,
            'allergies': allergiesE,
            'infectoType': infectoTypeE,
            'kidneyType': kidneyTypeE,
            'liverType': liverTypeE,
            'cerebralPalsy': cerebralPalsyE,
            'diabetesType': diabetesTypeE,
            'hearthType': hearthTypeE,
            'cancerType': cancerTypeE,
            'lungType': lungTypeE,
            'bloodType': bloodTypeE
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
  },

  signupMember: (req, res) => {
    let resRoute = `pages/signupMember`;
    User.findOne({
        'email': req.body.email
      },
      (err, user) => {
        if (err) {
          throw err;
        }
        //Si no existe el usuario, creamos la membresía
        if (!user) {
          let member = createMember(req);
          createMembership(req, res, member, resRoute);
        } else {
          res.status(404).render(resRoute, {
            user: req.user,
            message: 'El usuario ya existe',
            'memberTypes': memberTypes,
            data: req.body
          });
        }
      }
    );
  }

} //Fin Exports
