'use strict'

const User = require('../models/user')
const Doctor = require('../models/doctor')
const service = require('../services/index')
const expiringTime = 365; //days

function createMember(req) {
  let member = new User();
  member.name = req.body.name;
  member.dadLastName = req.body.dadLastName;
  member.momLastName = req.body.momLastName;
  //member.birthday     = req.body.birthday;
  member.email = req.body.email;
  member.password = member.generateHash(req.body.memberId);
  member.cp = req.body.cp;
  //member.gender       = req.body.gender;
  member.cellphone = req.body.cellphone;
  member.fullName = `${member.name} ${member.dadLastName} ${member.momLastName}`;
  member.membership.memberId = req.body.memberId;
  member.membership.type = 'A';
  member.membership.startDate = Date.now();
  member.membership.expiringDate = Date.now();
  member.membership.expiringDate.setTime(
    member.membership.expiringDate.getTime() + expiringTime * 86400000);

  return member;
}

function insertMember(req, res) {
  User.findOne({
      'email': req.body.email
    },
    (err, user) => {
      if (err) {
        throw err;
      }
      if (!user) {
        let member = createMember(req);
        member.save((err) => {
          if (err) {
            throw err;
          }
          res.status(200).redirect('/');
        });
      } else {
        res.status(500).render('pages/500', {
          message: 'El usuario ya existe'
        });
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
  User.findOne({
      'membership.memberId': req.body.memberId
    },
    (err, member) => {
      if (err) {
        throw err;
      }
      if (member) {
        res.status(200).render('pages/profile', {
          user: member
        });
      } else {
        res.status(204).redirect('error');
      }
    });
}
function isMember(req, res){
  User.findOne({
    'membership.memberId': req.query.memberId
    },
    (err, member) =>{
      if(err){
        throw err;
      }
      if(member){
        res.status(200).send();
      }else{
        res.status(204).send();
      }
    }
  );
}

function verifyToken(req, res){
  var token = req.body.token;
  var memberId = req.body.memberId;
  User.findOne({
    'membership.memberId':memberId,
    'verificationCode':token,
  }, function(err, user){
    if(err){
      throw err;
    }
    if(user){
      res.status(200).send();
    }else{
      res.status(204).send();
    }
  });
}

module.exports = {
  createMember,
  insertMember,
  getMembersByName,
  loadMemberProfile,
  isMember,
  verifyToken
}
