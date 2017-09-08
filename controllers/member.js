'use strict'

const User = require('../models/user')
const Membership = require('../models/membership')
const memberTypes = Membership.schema.path('type').enumValues
const Doctor = require('../models/doctor')
const MR = require('../models/medicalRecord')
const service = require('../services/index')
const expiringTime = 365; //days

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
  var day = birthday.substring(birthday.length-2,birthday.length);
  var month = birthday.substring(4, 6);
  var year = birthday.substring(0,4);
  //ATRIBUTOS SEGUN LA NOM
  member.name = req.body.name;
  member.dadLastName = req.body.dadLastName;
  member.momLastName = req.body.momLastName;
  member.nac_origen = req.body.nac_origen;
  member.edo_nac = pad(req.body.edo_nac,2);
  member.municipio = pad(req.body.mun,3);
  member.localidad = pad(req.body.loc,4);
  member.residence = pad(req.body.residence,2);
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
              throw err;
            }
            //Actualizamos la membresía
            membership.isActive = true;
            membership.save((err, membershipUpdated) => {
              if (err) {
                throw err;
              }
              if (req.user) {
                //Mostrar información del miembro: Id, email, contraseña
                var accType = req.user.accType;
                res.status(200).render(`pages/newMemberInfo`, {
                  user: req.user,
                  'membership': membership,
                  'member': member
                });
              } else {
                //TODO: Mostrar información del miembro: Id, email, contraseña
                res.status(200).send(membershipUpdated);
              }
            });
          });
        });
      } else {
        //La membresía está ocupada
        if (req.user) {
          res.status(404).render(resRoute, {
            user: req.user,
            message: 'Esa membresía ya está ocupada.',
            'memberTypes': memberTypes
          });
        } else {
          res.status(404).send('Membresia no encontrada.');
        }
      }
    } else {
      //Esa membresía es incorrecta y se debe notificar
      if (req.user) {
        res.status(404).render(resRoute, {
          user: req.user,
          message: 'Membresia no encontrada.',
          'memberTypes': memberTypes
        });
      } else {
        res.status(404).send('Membresia no encontrada.');
      }
    }
  });

}

function signupMember(req, res) {
  var resRoute = "";
  //Si fue un usuario
  if (req.user) {
    resRoute = `pages/signupMember`;
  }
  /*User.findOne({
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
        if (req.user) {
          res.status(204).render(resRoute, {
            user: req.user,
            message: 'El usuario ya existe',
            'memberTypes': memberTypes
          });
        } else {
          res.status(204).send('El usuario ya existe.');
        }
      }
    }
  );*/
  let member = createMember(req);
  res.status(200).send(member);
}

function getMembersByName(req, res) {
  let name = req.query.name;
  User.find({
      'fullName': new RegExp(name),
      'accType': 'member'
    },
    (err, members) => {
      if (err) {
        throw err;
      }
      if (members.length == 0) {
        res.status(204).send('Not found');
      } else {
        res.status(200).send(members);
      }
    });
}

function loadMemberProfile(req, res) {
  //TODO
}

function isMember(req, res) {
  Membership.findOne({
    'memberId': req.query.memberId
  }, (err, membership) => {
    if (err) {
      throw err;
    }
    if (membership) {
      res.status(200).send();
    } else {
      res.status(204).send();
    }
  });
}

function verifyToken(req, res) {
  var token = req.body.token;
  var memberId = req.body.memberId;
  //TODO: desencriptar código de verificación
  Membership.findOne({
    'verificationCode': token,
    'memberId': memberId
  }).
  select("-_id").
  populate({
    path:'userProfile',
    model: 'User',
    select: '-_id fullName',
  }).
  exec((err, membership) => {
    if (membership) {
      res.status(200).send(membership);
    } else {
      res.status(204).send();
    }
  });
}

function loadSignupMember(req, res) {
  res.status(200).render('pages/signupMember', {
    user: req.user
  });
}

module.exports = {
  createMember,
  signupMember,
  getMembersByName,
  loadMemberProfile,
  isMember,
  verifyToken,
  loadSignupMember
}
