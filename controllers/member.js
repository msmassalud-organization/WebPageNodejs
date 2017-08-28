'use strict'

const User = require('../models/user')
const Membership = require('../models/membership')
const memberTypes = Membership.schema.path('type').enumValues
const Doctor = require('../models/doctor')
const MR  = require('../models/medicalRecord')
const service = require('../services/index')
const expiringTime = 365; //days

function createMember(req) {
  let member = new User();
  var birthday = req.body.birthday;
  birthday = birthday.split("-");
  var dateFormat = birthday[2] + "-" + birthday[1] + "-" + birthday[0];

  member.name = req.body.name;
  member.dadLastName = req.body.dadLastName;
  member.momLastName = req.body.momLastName;
  //member.birthday = req.body.birthday;
  member.email = req.body.email;
  //TODO: generar password: fecha de nacimiento con apellido paterno
  member.password = member.generateHash(req.body.memberId);
  member.cp = req.body.cp;
  //member.gender       = req.body.gender;
  member.cellphone = req.body.cellphone;
  member.fullName = `${member.name} ${member.dadLastName} ${member.momLastName}`;

  return member;
}

function createMembership(req, res, member, resRoute){

  //Primero debemos revisar que la membresía no esté ocupada
  Membership.findOne({
      'memberId':req.body.memberId
    }, (err, membership) =>{
      if(err){
        throw err;
      }
      //Si la membresía existe
      if(membership){
        //Si la membresía no está ligada a un usuario, se liga y se actualiza
        if(!membership.userProfile){
          member.membership = membership._id;
          membership.type = req.body.type;
          membership.userProfile = member._id;
          membership.startDate = Date.now();
          membership.expiringDate = Date.now();
          membership.expiringDate.setTime(
            membership.expiringDate.getTime() + expiringTime * 86400000);
          //Creamos el expediente médico
          let mr = new MR();
          member.medicalRecord = mr._id;
          //Verificamos si hay alguien ayudando al usuario
          if(req.user){
            membership.helpedBy = req.user._id;
          }
          //Guardamos el expediente médico
          mr.save((err)=>{
            //Guardamos primero al usuario
            member.save((err)=>{
              if(err){
                throw err;
              }
              //Actualizamos la membresía
              membership.save((err, membershipUpdated)=>{
                if(err){
                  throw err;
                }
                if(req.user){
                  res.redirect('/dashboard');
                }else{
                  res.status(200).send(membershipUpdated);
                }
              });
            });
          });
        }else{
          //La membresía está ocupada
          if(req.user){
            res.status(404).render(resRoute,{
              user: req.user,
              message: 'Esa membresía ya está ocupada.',
              'memberTypes': memberTypes
            });
          }else{
            res.status(404).send('Membresia no encontrada.');
          }
        }
      }else{
        //Esa membresía es incorrecta y se debe notificar
        if(req.user){
          res.status(404).render(resRoute,{
            user: req.user,
            message: 'Membresia no encontrada.',
            'memberTypes': memberTypes
          });
        }else{
          res.status(404).send('Membresia no encontrada.');
        }
      }
    }
  );

}

function insertMember(req, res) {
  var resRoute = "";
  //Si fue un usuario
  if(req.user){
    resRoute = `dashboards/${req.user.accType}/signupMember`;
  }
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
        if(req.user){
          res.status(204).render(resRoute,{
            user: req.user,
            message: 'El usuario ya existe',
            'memberTypes': memberTypes
          });
        }else{
          res.status(204).send('El usuario ya existe.');
        }
      }
    }
  );
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

function loadSignupMember(req, res){
  res.status(200).render('pages/signupMember', {
    user: req.user
  });
}

module.exports = {
  createMember,
  insertMember,
  getMembersByName,
  loadMemberProfile,
  isMember,
  verifyToken,
  loadSignupMember
}
