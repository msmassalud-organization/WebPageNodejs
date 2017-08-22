'use-strict'
var User = require('../models/user');
const expiringTime = 365; //days
const service = require('../services/index')
const moment = require('moment')

function getAllUsers(req, res) {
  User.find({},
    (err, users) => {
      if (err) {
        throw err;
      }
      res.render('pages/index', {
        userList: users,
        user: req.user
      });
    });
}

function signIn(req, res) {
  var email = req.body.email;
  User.findOne({
    'email': email
  }, function(err, user) {
    if (err) {
      res.status(500).send(err);
    }
    if (user.validPassword(req.body.password)) {
      res.status(200).send(user);
    } else {
      res.status(403).send("Contraseña incorrecta");
    }

  });
}

function updateProfile(req, res) {
  console.log(req.body);
  var update = req.body;
  User.findByIdAndUpdate(req.user._id, update, function(err, userUpdated) {
    if (err) {
      res.status(500).send(err);
    }
    console.log(userUpdated);
    res.status(200).redirect("/loadDashboard");
  });
}

function createUser(req, res){
  let user = new User();
  console.log(req.body);
  user.name = req.body.name;
  user.dadLastName = req.body.dadLastName;
  user.momLastName = req.body.momLastName;
  user.email = req.body.email;
  user.password = user.generateHash(req.body.password);
  user.cellphone = req.body.cellphone;
  user.accType = req.body.accType;
  console.log();
  console.log(user);
  return user;
}

function insertUser(req, res) {
  User.findOne({
      'email': req.body.email
    },
    (err, user) => {
      if (err) {
        throw err;
      }
      if (!user) {
        let user = createUser(req);
        user.save((err) => {
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

module.exports = {
  insertUser,
  getAllUsers,
  updateProfile,
  signIn
}
