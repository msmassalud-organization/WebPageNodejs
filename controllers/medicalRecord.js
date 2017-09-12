const MR = require('../models/medicalRecord')
const User = require('../models/user')

//TODO: Eliminar Enumeraciones
const traumaAreasE = MR.schema.path('pathological.Trauma.physicalTraumaAreas').options.enum;
const hospitalizationTypeE = MR.schema.path('pathological.Hospitalizations.hospitalizationType').options.enum;
const allergiesE = MR.schema.path('pathological.Hospitalizations.allergies').options.enum;
const infectoTypeE = MR.schema.path('pathological.Diseases.infectoType').options.enum;
const lungTypeE = MR.schema.path('pathological.Diseases.lungType').options.enum;
const kindneyTypeE = MR.schema.path('pathological.Diseases.kindneyType').options.enum;
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
    sexualLife: req.body.sexualLife == 'Activo',
    alcoholicDrinks: req.body.alcoholicDrinks == "Si",
    cigarettes: req.body.cigarettes == "Si",
    otherDrugs: req.body.otherDrugs == "Si"
  };
  return noPathological;
}

function getImplantableMD(req) {
  let implantableMD = {
    dental: req.body.dental == 'Si',
    ocular: req.body.ocular == 'SI',
    hearing: req.body.hearing == 'SI',
    cosmetic: req.body.cosmetic == 'SI',
    cranial: req.body.cranial == 'SI',
    upperLimb: req.body.upperLimb == 'SI',
    coloum: req.body.colum == 'SI',
    lowerLimb: req.body.lowerLimb == 'SI',
    vascular: req.body.vasculas,
    cathers: req.body.cathers == 'SI',
    cardiac: req.body.cardiac == 'SI'
  };
  return implantableMD;
}

function getMomData(req) {
  let momRecord = {};
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

  if (req.body.hearthDiseaseM = !"Desconoce") {
    momRecord['hearthDisease'] = req.body.hearthDiseaseM == 'Si';
    var type = req.body.hearthTypeM;
    if (Array.isArray(type)) {
      if (type.length == 0) {
        hearthType = ['Desconoce'];
      } else {
        momRecord['hearthType'] = type;
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
    if (Array.isArray(type)) {
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
    if (Array.isArray(type)) {
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

  if (req.body.liverDiseaseM != "Desconoce") {
    momRecord['liverDiseas'] = req.body.liverDiseasM == 'Si';
    var type = req.body.liverDiseaseM;
    if (Array.isArray(type)) {
      if (type.length == 0) { //si no hay infomracion crea un desconoce
        momRecord['liverType'] = ['Desconoce'];
      } else {
        momRecord['liverType'] = type;
      }
    } // Fin del If Array
    else {
      momRecord['liverType'] = [type]; //crear un arreglo en caso de introducir solo 1 opcion
    }
  } // Fin del IF liverDisease

  return momRecord;

}

function getDadData(req) {
  let dadRecord = {};

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

  if (req.body.hearthDiseaseP = !"Desconoce") {
    dadRecord['hearthDisease'] = req.body.hearthDiseaseP == 'Si';
    var type = req.body.hearTypeP;
    if (Array.isArray(type)) {
      if (type.length == 0) {
        dadRecord['hearthType'] = ['Desconoce'];
      } else {
        dadRecord['hearthType'] = type;
      }
    } // Fin de IF hearthType ARRAY
    else {
      dadRecord['hearthType'] = [type];
    }
  } // Fin del IF desconoce

  if (req.body.cancerP != "Desconoce") {
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
    if (Array.isArray(type)) {
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
    if (Array.isArray(type)) {
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


  if (req.body.liverDiseaseP != "Desconoce") {
    dadRecord['liverDiseas'] = req.body.liverDiseasP == 'Si';
    var type = req.body.liverDiseaseP;
    if (Array.isArray(type)) {
      if (type.length == 0) { //si no hay infomracion crea un desconoce
        dadRecord['liverType'] = ['Desconoce'];
      } else {
        dadRecord['liverType'] = type;
      }
    } // Fin del If Array
    else {
      dadRecord['liverType'] = [type]; //crear un arreglo en caso de introducir solo 1 opcion
    }
  } // Fin del IF liverDisease

  return dadRecord;
}

function getTraumaData(req) {
  let trauma = {};

  trauma['sprains'] = req.body.sprains == 'Si';
  trauma['dislocations'] = req.body.dislocations == 'Si';
  trauma['boneFracture'] = req.body.boneFracture == 'Si';
  trauma['muscleStrain'] = req.body.muscleStrain == 'Si';
  trauma['bruises'] = req.body.bruises == 'Si';
  trauma['stringsOrbites'] = req.body.stringsOrbites == 'Si';
  trauma['considerableInjuries'] = req.body.considerableInjuries == 'Si';
  trauma['rehabilitationTherapy'] = req.body.rehabilitationTherapy == 'Si';
  trauma['physicalTraumaAreas'] = req.body.physicalTraumaAreas == 'Si';

  let pyshicalTraumaAreas {};

      if(Array.isArray(type)) {
        if (type.length == 0){
          trauma['pyshicalTraumaAreas'] = ['Desconoce'];
        } else {
          trauma['pyshicalTraumaAreas'] = type;
        }
      } //Fin Array isArray
      else {
        trauma['pyshicalTraumaAreas'] = type;
 = [type];
      }

  trauma['pyschologicalTrauma'] = req.body.pyschologicalTrauma == 'Si';

  return trauma;
} //Function Trauma

function getHospitalizationsData(req) {
  let hospitalizations = {};

  hospitalizations['isBeenHospitalized'] = req.body.isBeenHospitalizes == 'Si';
  hospitalizations['times'] = req.body.times == 'Si';
  hospitalizations['hospitalizationType'] = req.body.hospitalizationType == 'Si';

  let hospitalizationType = {};

    if(Array.isArray(type)) {
      if (type.length == 0){
        hospitalizations['hospitalizationType'] = req.body.hospitalizationType == 'Si';
      }
      else{
        hospitalizations['hospitalizationType']  = type;
      }
    } //Fin del If Arrray is Array
    else {
      hospitalizations['hospitalizationType'] = [type];
    }

  let bloodType = {};

    if (req.body.bloodType != "Desconoce") {
        hospitalization['bloodType'] = req.body.bloodType;
      }

  hospitalizations['bloodTransfer'] = req.body.bloodTransfer == 'Si';

  let allergies {};

      if(Array.isArray(type)) {
        if (type.length == 0){
          hospitalizations['allergies'] = ['Desconoce'];
        } else {
          hospitalizations['allergies'] = type;
        }
      } //Fin Array isArray
      else {
        hospitalizations['allergies'] = [type];
      }

  hospitalizacion['drugAddiction'] = req.body.drugAddiction == 'Si';
  hospitalizacion['vaccineScheme'] = req.body.vaccineScheme == 'Si';

  return hospitalizations;
} //Function Hospitalization

function getDiseasesData(req) {
  let diseases = {};
    diseases['enfInfectocontagiosas'] = req.body.enfInfectocontagiosas == 'Si';

  let infectoType {};

    if(Array.isArray(type)) {
      if(type.length == 0){
        diseases['infectoType'] = req.body.infectoType == 'Si';
      } else {
        diseases['infectoType'] = type;
      }
    } // Fin del Array isArray
    else {
      diseases['infectoType'] = [type];
    }

    diseases['diabetes'] = req.body.diabetes == 'Si';

  let diabetesType{};

    if (req.body.diabetesType != "Desconoce") {
        hospitalization['diabetesType'] = req.body.diabetesType;
      }

    diseases['lungDisease'] = req.body.lungDisease == 'Si';

  let lungType {};

    if(Array.isArray(type)){
      if(type.length == 0){
        diseases['lungType'] = req.body.lungType == 'Si';
      } else {
        diseases['lungType'] = type;
      }
    } // Fin del Array is Array
    else {
      diseases['lungType'] = [type];
    }

    diseases['kindneyDiseases'] == req.body.kindneyDiseases == "Si";

    let kindneyType {};

    if(Array.isArray(type)){
      if(type.length == 0){
        diseases['kindneyType'] = req.body.kindneyType == 'Si';
      } else {
        diseases['kindneyType'] = type;
      }
    } // Fin del Array is Array
    else {
      diseases['kindneyType'] = [type];
    }

    diseases['liverDisease'] == req.body.liverDisease == "Si";


    let liverType {};

    if(Array.isArray(type)){
      if(type.length == 0){
        diseases['liverType'] = req.body.liverType == 'Si';
      } else {
        diseases['liverType'] = type;
      }
    } // Fin del Array is Array
    else {
      diseases['liverType'] = [type];
    }

    diseases['convulsiones'] == req.body.convulsiones == "Si";


    let cerebralPalsy {};

    if(Array.isArray(type)){
      if(type.length == 0){
        diseases['cerebralPalsy'] = req.body.cerebralPalsy == 'Si';
      } else {
        diseases['cerebralPalsy'] = type;
      }
    } // Fin del Array is Array
    else {
      diseases['cerebralPalsy'] = [type];
    }


    diseases['hearthDisease'] == req.body.hearthDisease == "Si";


    let hearthType {};

    if(Array.isArray(type)){
      if(type.length == 0){
        diseases['hearthType'] = req.body.hearthType == 'Si';
      } else {
        diseases['hearthType'] = type;
      }
    } // Fin del Array is Array
    else {
      diseases['hearthType'] = [type];
    }

    diseases['cancer'] == req.body.cancer == "Si";

    let cancerType {};

    if(Array.isArray(type)){
      if(type.length == 0){
        diseases['cancerType'] = req.body.cancerType == 'Si';
      } else {
        diseases['cancerType'] = type;
      }
    } // Fin del Array is Array
    else {
      diseases['cancerType'] = [type];
    }


  return diseases;
}
//Fin funciones para extraer informacion del formulario

//FUNCIONES PRINCIPALES
module.exports = {

  updateMedicalRecord: (req, res)=>{
    //Expediente Médico - Antecedentes Familiares
    let relativeMR = {}
    let dadRecord = getDadData(req);
    let momRecord = getMomData(req);
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

  loadMedicalRecord : (req, res)=>{
    if (!req.user.medicalRecord) {
      //Crear expediente médico
      MRController.insert(req, res);
    } else {
      //nadita nanais
      res.status(200).render('pages/updateMedicalRecord', {
        user: req.user,
        'physicalTraumaAreas': traumaAreasE,
        'hospitalizationType':hospitalizationTypeE,
        'allergies':allergiesE,
        'infectoType':infectoTypeE,
        'kindneyType':kindneyTypeE,
        'liverType':liverTypeE,
        'cerebralPalsy':cerebralPalsyE,
        'diabetesType':diabetesTypeE,
        'hearthType':hearthTypeE,
        'cancerType':cancerTypeE,
        'menu':'/updateMedicalRecord'
      });
    }
  },

  insertMedicalRecord: (req, res)=>{
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
