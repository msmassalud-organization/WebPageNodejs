'use-strict'
const User = require('../models/user')
const Doctor = require('../models/doctor')
const SystemEvent = require('../models/systemEvent')
const SEC = require('../controllers/systemEvent')

const LOGOUT = 'LOGOUT'

function createUser(req, res) {
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

module.exports = {

  getAllUsers: (req, res) => {
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
  },

  signIn: (req, res) => {
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
  },

  insertUser: (req, res) => {
    User.findOne({
        'email': req.body.email
      },
      (err, user) => {
        if (err) {
          throw err;
        }
        //Creamos el usuario si no existe
        if (!user) {
          let user = createUser(req);
          //Si es doctor, creamos su perfil específico
          if (user.accType == 'doctor') {
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
                res.status(200).redirect('/signin');
              });
            });
          } else {
            user.save((err) => {
              if (err) {
                throw err;
              }
              res.status(200).redirect('/signin');
            });
          } //Fin Crear usuario
        } else {
          res.status(500).render('pages/500', {
            message: 'El usuario ya existe'
          });
        }
      } //fin CallbackFindOne
    ); //fin FindOne
  },

  logOut: (req,res)=>{
    if(req.user){
      let systemEvent = new SystemEvent();
      systemEvent.description = SEC.getEventDescription(LOGOUT, req.user);
      systemEvent.performedBy = req.user._id;
      systemEvent.save((err)=>{
        if(err){
          throw err;
        }
        req.logout();
        res.redirect('/signin');
      });
    }else{
      res.redirect('/signin');
    }
  },
  //AJAX
  existsByEmail: (req, res)=>{
    if(req.xhr){
      User.findOne({
        'email':req.query.email
      }, (err, user)=>{
        if(err){
          res.status(500).send();
        }

        if(user){
          res.status(200).send();
        }else{
          res.status(204).send();
        }
      })
    }else{
      res.status(403).send("Acceso restringido");
    }
  }
}
