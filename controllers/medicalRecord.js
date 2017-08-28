const MR = require('../models/medicalRecord')
const User = require('../models/user')

function create(req, res){
  let mr = new MR();
  return mr;
}

function insert(req, res){
  //Creamos el expediente médico
  let mr = create(req);
  //Guardamos en base de datos y después lo asignamos a usuario
  mr.save((err) =>{
    if(err){
      //Mandamos el mensaje a la página o en su defecto lo enviamos a la pagina de error
      res.status(500).send(err);
    }
    //Expediente medico
    console.log(mr);
    //Actualizamos al usuario
    var update = {medicalRecord: mr._id};
    User.findByIdAndUpdate(req.user._id, update, function(err, userUpdated){
      if(err){
        res.status(500).send(err);
      }
      console.log(userUpdated);
      res.status(200).render('pages/updateMedicalRecord',{
        user: req.user
      });
    });
  });
}

function update(req, res){
  //Buscamos el expediente médico del usuario
  //var update = req.body;
  //MR.findByIdAndUpdate(req.user.medicalRecord, update, function(err,mr){})

  var update;
  var noPathological;

update = {
    noPathological : {
      sexualLife : req.body.sexualLife == 'Activo',
      diseasesFreq : req.body.diseasesFreq,
      sleepingHours : req.body.sleepingHours,
      mealQuality: req.body.mealQuality,
      preventiveReviews: req.body.preventiveReviews,
      stressLevel: req.body.stressLevel,
      workoutsDays: req.body.workoutsDays,
      sugaryDrinks: req.body.sugaryDrinks,
      alcoholicDrinks: req.body.alcoholicDrinks,
      cigarettes: req.body.cigarettes,
      otherDrugs: req.body.otherDrugs
    }
};


  console.log(update);
  MR.findById(req.user.medicalRecord, function(err, mr){
    if(err){
      res.status(500).send(err);
    }
    if(mr){
      res.status(200).send(req.body);
    }else{
      res.status(404).send("No se encontró el expediente médico.");
    }
  });
}

module.exports = {
  insert,
  update
}
