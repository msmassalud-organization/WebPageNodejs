'use strict'

const User = require('../models/user')
const Membership = require('../models/membership')
const memberTypes = Membership.schema.path('type').enumValues
const Doctor = require('../models/doctor')
const MR = require('../models/medicalRecord')
const service = require('../services/index')


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

function existsById(req, res) {
  if(req.xhr){
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
  }else{
    res.status(403).send();
  }
}

function isTaken(req,res){
  if(req.xhr){
    Membership.findOne({
      'memberId': req.query.memberId
    }, (err, membership)=>{
      if(err){
        res.status(500).send();
      }
      if(membership){
        //si la membresía ya fue tomada
        if(membership.userProfile){
          res.status(200).send();
        }else{
          res.status(204).send();
        }
      }else{
        res.status(500).send();
      }
    })
  }
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
    select: '-_id fullName email',
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
  getMembersByName,
  loadMemberProfile,
  existsById,
  verifyToken,
  isTaken
}
