const MR = require('../models/medicalRecord')
const User = require('../models/user')

function create(req, res) {
  let mr = new MR();
  return mr;
}

function loadMedicalRecord(req, res) {
  if (!req.user.medicalRecord) {
    //Crear expediente médico
    MRController.insert(req, res);
  } else {
    //nadita nanais
    res.status(200).render('dashboards/member/updateMedicalRecord', {
      user: req.user
    });
  }
}

function insert(req, res) {
  //Creamos el expediente médico
  let mr = create(req);
  //Guardamos en base de datos y después lo asignamos a usuario
  mr.save((err) => {
    if (err) {
      //Mandamos el mensaje a la página o en su defecto lo enviamos a la pagina de error
      res.status(500).send(err);
    }
    //Expediente medico
    console.log(mr);
    //Actualizamos al usuario
    var update = {
      medicalRecord: mr._id
    };
    User.findByIdAndUpdate(req.user._id, update, function(err, userUpdated) {
      if (err) {
        res.status(500).send(err);
      }
      console.log(userUpdated);
      res.status(200).render('dashboards/member/updateMedicalRecord', {
        user: req.user
      });
    });
  });
}

function update(req, res) {
  //Buscamos el expediente médico del usuario
  //var update = req.body;
  //MR.findByIdAndUpdate(req.user.medicalRecord, update, function(err,mr){})

  var update;
  var noPathological;
  console.log("/updateMedicalRecord");

  update = {
    noPathological: {
      sexualLife: req.body.sexualLife == 'Activo',
      diseasesFreq: req.body.diseasesFreq,
      sleepingHours: req.body.sleepingHours,
      mealQuality: req.body.mealQuality,
      preventiveReviews: req.body.preventiveReviews,
      stressLevel: req.body.stressLevel,
      workoutsDays: req.body.workoutsDays,
      sugaryDrinks: req.body.sugaryDrinks,
      alcoholicDrinks: req.body.alcoholicDrinks == "Si",
      cigarettes: req.body.cigarettes == "Si",
      otherDrugs: req.body.otherDrugs == "Si"
    },

    implantableMD: {
      dental: req.body.dental == 'Si',
      ocular: req.body.ocular == 'SI',
      hearing: req.body.hearing == 'SI',
      cosmetic: req.body.cosmetic == 'SI',
      cranial: req.body.cranial == 'SI' ,
      upperLimb: req.body.upperLimb == 'SI' ,
      colum: req.body.colum == 'SI' ,
      lowerLimb: req.body.lowerLimb == 'SI' ,
      vasculas: req.body.vasculas  ,
      cathers: req.body.cathers == 'SI',
      cardiac: req.body.cardiac == 'SI'
    }
  }; //Fin UPDATE

// Inicia dadRecord

  var relativeMR = {}
  var dadRecord = {}
  var momRecord = {}

  if (req.body.diabetesP != "Desconoce") {
    dadRecord['diabetes'] = req.body.diabetesP == 'Si';
    var type = req.body.diabetesTypeP;
    if (Array.isArray(type)) {
      if (type.length == 0) {
        dadRecord['diabetesType'] = ['Desconoce'];
      } else {
        dadRecord['diabetesType'] = type;
      }
    } // Fin de IF ISArray
    else {
        dadRecord['diabetesType'] = [type];
      }
  } // Fin del IF desconoce

  if (req.body.hearthDiseaseP = ! "Desconoce") {
    dadRecord['hearthDisease'] = req.body.hearthDiseaseP == 'Si';
    var type = req.body.hearTypeP;
    if (Array.isArray(type)) {
      if (type.length == 0) {
        hearthType = ['Desconoce'];
      } else {
        dadRecord['hearthType']= type;
      }
    } // Fin de IF hearthType ARRAY
    else {
        dadRecord['hearthType'] = [type];
    }
  } // Fin del IF desconoce

  if (req.body.cancer != "Desconoce") {
    dadRecord['cancer'] = req.body.cancerP == 'Si';
    var type = req.body.cancerTypeP;
    if (Array.isArray(type)) {
      if (type.length == 0) {
        dadRecord['cancerType'] = ['Desconoce'];
      } else {
        dadRecord['cancerType'] = type;
      }
    } // Fin del IF dadRecord['cancerType'] Array
    else {
      dadRecord['cancerType'] = [type];
    }
  } // Fin del IF de cancer Desconoce

  headache: req.body.headache == 'Si'

  if (req.body.lungDiseaseP != "Desconoce") {
    dadRecord['lungDisease'] = req.body.lungDiseaseP == 'Si';
    var type = req.body.lungTypeP;
    if(Array.isArray(type)) {
      if (type.length == 0) {
        dadRecord['lungType'] = ['Desconoce'];
      } else {
        dadRecord['lungType'] = type;
      }
  } // Fin del IF de dadRecord['lungType'] Array
  else {
    dadRecord['lungType'] = [type];
  }
} // Fin del IF de Lung Desconoce

 if (req.body.kindneyDiseasesP != "Desconoce") {
   dadRecord['kindneyDiseases'] = req.body.kindneyDiseasesP == 'Si';
   var type = req.body.kindneyTypeP;
   if (Array.isArray(type)){
     if (type.length == 0) {
       dadRecord['kindneyType'] = ['Desconoce'];
     } else {
       dadRecord['kindneyType'] = type;
     }
 } //Fin del Array de dadRecord['kindneyType'] Array
 else {
   dadRecord['kindneyDiseases'] = [type];
 }
} // Fin del IF kidney Desconoce


 if (req.body.liverDiseaseP != "Desconoce"){
   dadRecord['liverDiseas'] = req.body.liverDiseasP == 'Si';
   var type = req.body.liverDiseaseP;
   if (Array.isArray(type)){
     if (type.length == 0){ //si no hay infomracion crea un desconoce
       dadRecord['liverType'] = ['Desconoce'];
     } else {
       dadRecord['liverType'] = type;
     }
   } // Fin del If Array
  else {
    dadRecord['liverType'] = [type]; //crear un arreglo en caso de introducir solo 1 opcion
  }
} // Fin del IF liverDisease

// Finaliza Dad RECORD

//Inicia momRecord

if (req.body.diabetesM != "Desconoce") {
  momRecord['diabetesM'] = req.body.diabetesM == 'Si';
  var type = req.body.diabetesTypeM;
  if (Array.isArray(type)) {
    if (type.length == 0) {
      momRecord['diabetesType'] = ['Desconoce'];
    } else {
      momRecord['diabetesType'] = type;
    }
  } // Fin de IF ISArray
  else {
      momRecord['diabetesType'] = [type];
    }
} // Fin del IF desconoce

if (req.body.hearthDiseaseM = ! "Desconoce") {
  momRecord['hearthDisease'] = req.body.hearthDiseaseM == 'Si';
  var type = req.body.hearthTypeM;
  if (Array.isArray(type)) {
    if (type.length == 0) {
      hearthType = ['Desconoce'];
    } else {
      momRecord['hearthType']= type;
    }
  } // Fin de IF hearthType ARRAY
  else {
      momRecord['hearthType'] = [type];
  }
} // Fin del IF desconoce

console.log(req.body.cancerM);
if (req.body.cancer != "Desconoce") {
  momRecord['cancer'] = req.body.cancerM == 'Si';
  var type = req.body.cancerTypeM;
  if (Array.isArray(type)) {
    if (type.length == 0) {
      momRecord['cancerType'] = ['Desconoce'];
    } else {
      momRecord['cancerType'] = type;
    }
  } // Fin del IF momRecord['cancerType'] Array
  else {
    momRecord['cancerType'] = [type];
  }
} // Fin del IF de cancer Desconoce

if (req.body.lungDiseaseM != "Desconoce") {
  momRecord['lungDisease'] = req.body.lungDiseaseM == 'Si';
  var type = req.body.lungTypeM;
  if(Array.isArray(type)) {
    if (type.length == 0) {
      momRecord['lungType'] = ['Desconoce'];
    } else {
      momRecord['lungType'] = type;
    }
} // Fin del IF de momRecord['lungType'] Array
else {
  momRecord['lungType'] = [type];
}
} // Fin del IF de Lung Desconoce

if (req.body.kindneyDiseasesM != "Desconoce") {
  momRecord['kindneyDiseases'] = req.body.kindneyDiseasesM == 'Si';
  var type = req.body.kindneyTypeM;
  if (Array.isArray(type)){
    if (type.length == 0) {
      momRecord['kindneyType'] = ['Desconoce'];
    } else {
      momRecord['kindneyType'] = type;
    }
} //Fin del Array de momRecord['kindneyType'] Array
else {
  momRecord['kindneyType'] = [type];
}
} // Fin del IF kidney Desconoce

if (req.body.liverDiseaseM != "Desconoce"){
  momRecord['liverDiseas'] = req.body.liverDiseasM == 'Si';
  var type = req.body.liverDiseaseM;
  if (Array.isArray(type)){
    if (type.length == 0){ //si no hay infomracion crea un desconoce
      momRecord['liverType'] = ['Desconoce'];
    } else {
      momRecord['liverType'] = type;
    }
  } // Fin del If Array
 else {
   momRecord['liverType'] = [type]; //crear un arreglo en caso de introducir solo 1 opcion
 }
} // Fin del IF liverDisease


var pathological;
var Trauma
var Hospitalizations
var Diseases

pathological['sprains'] = req.body.sprains == 'Si';
pathological['dislocations'] = req.body.dislocations == 'Si';
pathological['boneFracture'] = req.body.boneFracture == 'Si';
pathological['muscleStrain'] = req.body.muscleStrain == 'Si';


/*if (req.body.sprains != "Desconoce"){
  pathological[]
}*/


  let mr = new MR();
  console.log(dadRecord);
  res.send(dadRecord);
  /*mr.noPathological = update.noPathological;
  mr.save((err) => {
    if (err) {
      throw err;
    }
    console.log(mr);
    res.status(200).send(update);
  });*/



  /*MR.findById(req.user.medicalRecord, function(err, mr){
    if(err){
      res.status(500).send(err);
    }
    if(mr){
      res.status(200).send(req.body);
    }else{
      res.status(404).send("No se encontró el expediente médico.");
    }
  });*/
}

module.exports = {
  insert,
  update,
  loadMedicalRecord
}
