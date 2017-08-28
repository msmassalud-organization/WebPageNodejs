'use strict'

const User = require('../models/user')
const Doctor = require('../models/doctor')
const Membership = require('../models/membership')
const accTypes = User.schema.path('accType').enumValues;
const memberTypes = Membership.schema.path('type').enumValues;
const route = 'dashboards/admin'

function createUser(req){
  let user = new User();
  user.name = req.body.name;
  user.dadLastName = req.body.dadLastName;
  user.momLastName = req.body.momLastName;
  user.email = req.body.email;
  user.password = user.generateHash(req.body.password);
  user.cellphone = req.body.cellphone;
  user.accType = req.body.accType;
  return user;
}

function insertDoctor(req, res, user){
  var doctorProfile = new Doctor();
  user.doctorProfile = doctorProfile._id;
  doctorProfile.save((err) =>{
    if(err){
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

function signupUser(req, res){
  //Primero tenemos que asegurar que no exista el usuario
  User.findOne({
    'email': req.body.email
  },
  (err, user) =>{
    if(err){
      res.status(500).render('pages/500',{message:err});
    }else{
      //Creamos el usuario si no existe
      if(!user){
        let user = createUser(req);
        if(user.accType == 'doctor'){
          insertDoctor(req, res, user);
        }else{
          user.save((err) =>{
            if(err){
              res.status(500).render('pages/500',{message:err});
            }else{
              res.status(200).redirect('/dashboard');
            }
          })
        }
      }else{
        res.status(204).render(`${route}/signup`,{
          user: req.user,
          'accTypes': accTypes,
          message: 'El usuario ya existe.'
        });
      }
    }
  }
);
}

function loadSignupUser(req, res){
  res.status(200).render(`${route}/signup`,{
    user: req.user,
    'accTypes': accTypes
  });
}

function loadSignupMember(req, res){
  res.status(200).render(`${route}/signupMember`,{
    user: req.user,
    'memberTypes': memberTypes,
    message: ''
  });
}

function createMemberships(req, res){
  Membership.find({}, (err, memberships)=>{
    if(err){
      throw err;
    }

    //El ultimo ingresado será  equivalente al tamaño del arreglo
    var initId = memberships.length;
    var arr = [];
    for(var i=0; i < req.body.cant; i++){
      var membAux = new Membership();
      membAux.memberId = i + 1;
      arr.push(membAux);
    }
    Membership.insertMany(arr, (err, docs)=>{
      if(err){
        throw err;
      }
      res.status(200).send(`${arr.length}`);
    });

  });
}


module.exports = {
  signupUser,
  loadSignupUser,
  loadSignupMember,
  createMemberships
}
