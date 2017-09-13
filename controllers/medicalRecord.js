const MR = require('../models/medicalRecord')
const User = require('../models/user')

//TODO: Eliminar Enumeraciones
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

//Funciones para extraer información del formulario
function getNoPathological(req) {
  var noPathological = {
    diseasesFreq: req.body.diseasesFreq,
    sleepingHours: req.body.sleepingHours,
    mealTimes: req.body.mealTimes,
    mealQuality: req.body.mealQuality,
    preventiveReviews: req.body.preventiveReviews,
    stressLevel: req.body.stressLevel,
    workoutsDays: req.body.workoutsDays,
    sugaryDrinks: req.body.sugaryDrinks,
    sexualLife: req.body.sexualLife.toUpperCase() == 'ACTIVO',
    alcoholicDrinks: req.body.alcoholicDrinks,
    cigarettes: req.body.cigarettes,
    otherDrugs: req.body.otherDrugs.toUpperCase() == 'SI'
  };
  return noPathological;
}

function getImplantableMD(req) {
  let implantableMD = {
    dental: req.body.dental.toUpperCase() == 'SI',
    ocular: req.body.ocular.toUpperCase() == 'SI',
    hearing: req.body.hearing.toUpperCase() == 'SI',
    cosmetic: req.body.cosmetic.toUpperCase() == 'SI',
    cranial: req.body.cranial.toUpperCase() == 'SI',
    upperLimb: req.body.upperLimb.toUpperCase() == 'SI',
    coloum: req.body.coloum.toUpperCase() == 'SI',
    lowerLimb: req.body.lowerLimb.toUpperCase() == 'SI',
    vascular: req.body.vascular.toUpperCase() == 'SI',
    cathers: req.body.cathers.toUpperCase() == 'SI',
    cardiac: req.body.cardiac.toUpperCase() == 'SI'
  };
  return implantableMD;
}

/**
@param relative: 'M' o 'P'
*/
function getRelativeData(req, relative) {
  let relativeRecord = {};
  //Inicia relativeRecord
  var type;
  relativeRecord['isAlive'] = req.body['isAlive' + relative] == 'SI';
  relativeRecord['obesity'] = req.body['obesity' + relative] == 'SI';
  relativeRecord['arthritis'] = req.body['arthritis' + relative] == 'SI';
  relativeRecord['headache'] = req.body['headache' + relative] == 'SI';

  if (req.body['diabetes' + relative] != "Desconoce") {
    relativeRecord['diabetes'] = req.body['diabetes' + relative].toUpperCase() == 'SI';
    if (relativeRecord['diabetes']) {
      type = req.body['diabetesTypeM'];
      if (Array.isArray(type)) {
        if (type.length == 0) {
          relativeRecord['diabetesType'] = ['Desconoce'];
        } else {
          relativeRecord['diabetesType'] = type;
        }
      } // Fin de IF ISArray
      else {
        relativeRecord['diabetesType'] = [type];
      }
    }
  } // Fin del IF desconoce

  if (req.body['hearthDisease' + relative] = !"Desconoce") {
    relativeRecord['hearthDisease'] = req.body['hearthDisease' + relative].toUpperCase() == 'SI';
    if (relativeRecord['hearthDisease']) {
      type = req.body['hearthType' + relative];
      if(type != undefined){
        if (Array.isArray(type)) { //verificar si hay más de una seleccionada
          relativeRecord['hearthType'] = type;
        } // Fin de IF hearthType ARRAY
        else { //Solo hay una seleccionada
          relativeRecord['hearthType'] = [type];
        }
      }else{//No se seleccionó ni madres
        hearthType = ['Desconoce'];
      }
    }
  } // Fin del IF desconoce

  if (req.body['cancer' + relative] != "Desconoce") {
    relativeRecord['cancer'] = req.body['cancer' + relative].toUpperCase() == 'SI';
    if (relativeRecord['cancer']) {
      type = req.body['cancerType' + relative];
      if (Array.isArray(type)) {
        if (type.length == 0) {
          relativeRecord['cancerType'] = ['Desconoce'];
        } else {
          relativeRecord['cancerType'] = type;
        }
      } // Fin del IF relativeRecord['cancerType'] Array
      else {
        relativeRecord['cancerType'] = [type];
      }
    }
  } // Fin del IF de cancer Desconoce

  if (req.body['lungDisease' + relative] != "Desconoce") {
    relativeRecord['lungDisease'] = req.body['lungDisease' + relative].toUpperCase() == 'SI';
    if (relativeRecord['lungDisease']) {
      type = req.body['lungType' + relative];
      if (Array.isArray(type)) {
        if (type.length == 0) {
          relativeRecord['lungType'] = ['Desconoce'];
        } else {
          relativeRecord['lungType'] = type;
        }
      } // Fin del IF de relativeRecord['lungType'] Array
      else {
        relativeRecord['lungType'] = [type];
      }
    }
  } // Fin del IF de Lung Desconoce

  if (req.body['kidneyDisease' + relative] != "Desconoce") {
    relativeRecord['kidneyDisease'] = req.body['kidneyDisease' + relative].toUpperCase() == 'SI';
    if (relativeRecord['kidneyDisease']) {
      type = req.body['kidneyType' + relative];
      if (Array.isArray(type)) {
        if (type.length == 0) {
          relativeRecord['kidneyType'] = ['Desconoce'];
        } else {
          relativeRecord['kidneyType'] = type;
        }
      } //Fin del Array de relativeRecord['kidneyType'] Array
      else {
        relativeRecord['kidneyType'] = [type];
      }
    }
  } // Fin del IF kidney Desconoce

  if (req.body['liverDisease' + relative] != "Desconoce") {
    relativeRecord['liverDisease'] = req.body['liverDisease' + relative].toUpperCase() == 'SI';
    if (relativeRecord['liverDisease']) {
      type = req.body['liverType' + relative];
      if (Array.isArray(type)) {
        if (type.length == 0) { //si no hay infomracion crea un desconoce
          relativeRecord['liverType'] = ['Desconoce'];
        } else {
          relativeRecord['liverType'] = type;
        }
      } // Fin del If Array
      else {
        relativeRecord['liverType'] = [type]; //crear un arreglo en caso de introducir solo 1 opcion
      }
    }
  } // Fin del IF liverDisease
  return relativeRecord;
}


function getTraumaData(req) {
  let trauma = {};

  trauma['sprains'] = req.body.sprains.toUpperCase() == 'SI';
  trauma['dislocations'] = req.body.dislocations.toUpperCase() == 'SI';
  trauma['boneFracture'] = req.body.boneFracture.toUpperCase() == 'SI';
  trauma['muscleStrain'] = req.body.muscleStrain.toUpperCase() == 'SI';
  trauma['bruises'] = req.body.bruises.toUpperCase() == 'SI';
  trauma['stingsOrBites'] = req.body.stingsOrBites.toUpperCase() == 'SI';
  trauma['considerableInjuries'] = req.body.considerableInjuries.toUpperCase() == 'SI';
  trauma['rehabilitationTherapy'] = req.body.rehabilitationTherapy.toUpperCase() == 'SI';

  //TODO: verificar physicalTraumaAreas si undefined
  let physicalTraumaAreas = req.body.physicalTraumaAreas;
  if (Array.isArray(physicalTraumaAreas)) {
    if (physicalTraumaAreas.length == 0) {
      trauma['physicalTraumaAreas'] = ['Desconoce'];
    } else {
      trauma['physicalTraumaAreas'] = physicalTraumaAreas;
    }
  } //Fin Array isArray
  else {
    trauma['physicalTraumaAreas'] = [physicalTraumaAreas];
  }

  trauma['pyschologicalTrauma'] = req.body.pyschologicalTrauma.toUpperCase() == 'SI';

  return trauma;
} //Function Trauma

function getHospitalizationsData(req) {
  let hospitalizations = {};

  hospitalizations['isBeenHospitalized'] = req.body.isBeenHospitalized.toUpperCase() == 'SI';
  hospitalizations['times'] = req.body.times.toUpperCase() == 'SI';

  if (hospitalizations['isBeenHospitalized']) {
    let type = req.body.hospitalizationType;
    //TODO: hospitalizationType es undefined
    if (Array.isArray(type)) {
      if (type.length == 0) {
        hospitalizations['hospitalizationType'] = ['Desconoce'];
      } else {
        hospitalizations['hospitalizationType'] = type;
      }
    } //Fin del If Arrray is Array
    else {
      hospitalizations['hospitalizationType'] = [type];
    }
  }

  if (req.body.bloodType != "Desconoce") {
    hospitalizations['bloodType'] = req.body.bloodType;
  }

  hospitalizations['bloodTransfer'] = req.body.bloodTransfer.toUpperCase() == 'SI';

  //TODO: allergies es undefined
  var allergies = req.body.allergies;
  if (Array.isArray(allergies)) {
    if (type.length == 0) {
      hospitalizations['allergies'] = ['Desconoce'];
    } else {
      hospitalizations['allergies'] = allergies;
    }
  } //Fin Array isArray
  else {
    hospitalizations['allergies'] = [allergies];
  }

  hospitalizations['drugAddiction'] = req.body.drugAddiction.toUpperCase() == 'SI';
  hospitalizations['vaccineScheme'] = req.body.vaccineScheme.toUpperCase() == 'SI';

  return hospitalizations;
} //Function Hospitalization

function getDiseasesData(req) {
  let diseases = {};
  diseases['enfInfectocontagiosas'] = req.body.enfInfectocontagiosas.toUpperCase() == 'SI';

  type = req.body.infectoType;
  //TODO: type es undefined
  if (Array.isArray(type)) {
    if (type.length == 0) {
      diseases['infectoType'] = ['Desconoce'];
    } else {
      diseases['infectoType'] = type;
    }
  } // Fin del Array isArray
  else {
    diseases['infectoType'] = [type];
  }

  if (req.body['diabetes'] != "Desconoce") {
    diseases['diabetes'] = req.body['diabetes'].toUpperCase() == 'SI';
    if (diseases['diabetes']) {
      type = req.body['diabetesTypeM'];
      if (Array.isArray(type)) {
        if (type.length == 0) {
          diseases['diabetesType'] = ['Desconoce'];
        } else {
          diseases['diabetesType'] = type;
        }
      } // Fin de IF ISArray
      else {
        diseases['diabetesType'] = [type];
      }
    }
  } // Fin del IF desconoce

  if (req.body['hearthDisease'] = !"Desconoce") {
    diseases['hearthDisease'] = req.body['hearthDisease'].toUpperCase() == 'SI';
    if (diseases['hearthDisease']) {
      type = req.body['hearthType'];
      //TODO: type es undefined
      if (Array.isArray(type)) {
        if (type.length == 0) {
          hearthType = ['Desconoce'];
        } else {
          diseases['hearthType'] = type;
        }
      } // Fin de IF hearthType ARRAY
      else {
        diseases['hearthType'] = [type];
      }
    }
  } // Fin del IF desconoce

  if (req.body['cancer'] != "Desconoce") {
    diseases['cancer'] = req.body['cancer'].toUpperCase() == 'SI';
    if (diseases['cancer']) {
      type = req.body['cancerType'];
      //TODO: type es undefined
      if (Array.isArray(type)) {
        if (type.length == 0) {
          diseases['cancerType'] = ['Desconoce'];
        } else {
          diseases['cancerType'] = type;
        }
      } // Fin del IF diseases['cancerType'] Array
      else {
        diseases['cancerType'] = [type];
      }
    }
  } // Fin del IF de cancer Desconoce

  if (req.body['lungDisease'] != "Desconoce") {
    diseases['lungDisease'] = req.body['lungDisease'].toUpperCase() == 'SI';
    if (diseases['lungDisease']) {
      type = req.body['lungType'];
      //TODO: type es undefined
      if (Array.isArray(type)) {
        if (type.length == 0) {
          diseases['lungType'] = ['Desconoce'];
        } else {
          diseases['lungType'] = type;
        }
      } // Fin del IF de diseases['lungType'] Array
      else {
        diseases['lungType'] = [type];
      }
    }
  } // Fin del IF de Lung Desconoce

  if (req.body['kidneyDisease'] != "Desconoce") {
    diseases['kidneyDisease'] = req.body['kidneyDisease'].toUpperCase() == 'SI';
    if (diseases['kidneyDisease']) {
      type = req.body['kidneyType'];
      //TODO: type es undefined
      if (Array.isArray(type)) {
        if (type.length == 0) {
          diseases['kidneyType'] = ['Desconoce'];
        } else {
          diseases['kidneyType'] = type;
        }
      } //Fin del Array de diseases['kidneyType'] Array
      else {
        diseases['kidneyType'] = [type];
      }
    }
  } // Fin del IF kidney Desconoce

  if (req.body['liverDisease'] != "Desconoce") {
    diseases['liverDisease'] = req.body['liverDisease'].toUpperCase() == 'SI';
    if (diseases['liverDisease']) {
      type = req.body['liverType'];
      //TODO: type es undefined
      if (Array.isArray(type)) {
        if (type.length == 0) { //si no hay infomracion crea un desconoce
          diseases['liverType'] = ['Desconoce'];
        } else {
          diseases['liverType'] = type;
        }
      } // Fin del If Array
      else {
        diseases['liverType'] = [type]; //crear un arreglo en caso de introducir solo 1 opcion
      }
    }
  } // Fin del IF liverDisease

  diseases['convulsiones'] == req.body.convulsiones.toUpperCase() == 'SI';

  type = req.body.cerebralPalsy;
  //TODO: type es undefined
  if (Array.isArray(type)) {
    if (type.length == 0) {
      diseases['cerebralPalsy'] = ['Desconoce'];
    } else {
      diseases['cerebralPalsy'] = type;
    }
  } // Fin del Array is Array
  else {
    diseases['cerebralPalsy'] = [type];
  }

  return diseases;
}
//Fin funciones para extraer informacion del formulario

//FUNCIONES PRINCIPALES
module.exports = {

  updateMedicalRecord: (req, res) => {
    //Expediente Médico - Antecedentes Familiares
    let relativeMR = {}
    let dadRecord = getRelativeData(req, 'P');
    let momRecord = getRelativeData(req, 'M');

    relativeMR['dadRecord'] = dadRecord;
    relativeMR['momRecord'] = momRecord;
    //Fin antecedentes familiares

    //Expediente Médico - No Patologicos
    let noPathological = getNoPathological(req);

    //Expediente Médico - Dispositivos médicos implantables
    let implantableMD = getImplantableMD(req);

    //Expediente Médico - Patologicos
    let pathological = {};
    let trauma = getTraumaData(req);
    let hospitalizations = getHospitalizationsData(req);
    let diseases = getDiseasesData(req);

    pathological['Trauma'] = trauma;
    pathological['Hospitalizations'] = hospitalizations;
    pathological['Diseases'] = diseases;
    //Fin Patologicos

    //Preparación del update
    let update = {};
    update['noPathological'] = noPathological;
    update['implantableMD'] = implantableMD;
    update['relativeMR'] = relativeMR;
    update['pathological'] = pathological;

    let mr = new MR();
    console.log(update);
    res.send(update);
  },

  loadMedicalRecord: (req, res) => {
    if (!req.user.medicalRecord) {
      //Crear expediente médico
      MRController.insert(req, res);
    } else {
      //nadita nanais
      res.status(200).render('pages/updateMedicalRecord', {
        user: req.user,
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
        'menu': '/updateMedicalRecord'
      });
    }
  },

  insertMedicalRecord: (req, res) => {
    //Creamos el expediente médico
    let mr = new MR();
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
}
