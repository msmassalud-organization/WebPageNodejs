var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var MemberMedicalRecord = new mongoose.Schema({

  relativeMR : // ***  Relative ***
  {
    dadRecord : // *** RECORD DAD ***
    {
      isAlive: {type: Boolean},
      diabetes: {type: Boolean},
      diabetesType : {type: String,
                      enum : [ 'Tipo I', 'Tipo II', 'Otro', 'U', 'Y', 'N', 'U']
                                },
      obesity : {type: Boolean},
      arthritis : {type: Boolean},
      hearthDisease : {type: Boolean},
      hearthType : {type: [String],
                    enum : ['hipertension', 'hipotension', 'isquemia', 'angina de pecho', 'infarto de miocardio', 'muerte subita', 'enfermedad neumatica', 'ninguna']},
      cancer : {type: Boolean},
      cancerType : {type: [String],
                    enum: ['colon', 'recto', 'endométrico', 'prostata', 'mama', 'pulmon', 'leucemia', 'pancreas', 'tiroides', 'riñon', 'otro']},
      headache : {type: Boolean},
      lungDisease : {type: Boolean},
      lungType : {type: [String],
                  enum: ['neumonia', 'asma', 'enfisema', 'EPOC', 'endema', 'otro']},
      kindneyDiseases : {type: String},
      kindneyType : {type: [String],
                    enum : ['insuficiencia renal', 'cálculos renales', 'nefropatias', 'otro']},
      liverDisease: {type: String},
      liverType: {type: [String],
                  enum : ['hepatitis A', 'hepatitis B', 'hepatitis C', 'cirrosis', 'nemocromatosis', 'otra']}
                },
                // fin dadRecord

      momRecord : // *** RECORD MOM ***
      {
        isAlive: {type: Boolean},
        diabetes: {type: Boolean},
        diabetesType : {type: String,
                        enum : [ 'Tipo I', 'Tipo II', 'Otro']
                                  },
        obesity : {type: Boolean},
        arthritis : {type: Boolean},
        hearthDisease : {type: Boolean},
        hearthType : {type: [String],
                      enum : ['hipertension', 'hipotension', 'isquemia', 'angina de pecho', 'infarto de miocardio', 'muerte subita', 'enfermedad neumatica', 'ninguna']},
        cancer : {type: Boolean},
        cancerType : {type: [String],
                      enum: ['colon', 'recto', 'endométrico', 'mama', 'pulmon', 'leucemia', 'pancreas', 'tiroides', 'riñon', 'otro']},
        headache : {type: Boolean},
        lungDisease : {type: Boolean},
        lungType : {type: [String],
                    enum: ['neumonia', 'asma', 'enfisema', 'EPOC', 'endema', 'otro']},
        kindneyDiseases : {type: String},
        kindneyType : {type: [String],
                      enum : ['insuficiencia renal', 'cálculos renales', 'nefropatias', 'otro']},
        liverDisease: {type: String},
        liverType: {type: [String],
                    enum : ['hepatitis A', 'hepatitis B', 'hepatitis C', 'cirrosis', 'nemocromatosis', 'otra']}
                  },
                  // fin momRecors



  }, // fin relativeMR

  pathological: //** Comienza Pathological **
  {
    Trauma:
    {
      sprains: {type: Boolean},
      dislocations: {type: Boolean},
      boneFracture: {type: Boolean},
      muscleStrain: {type: Boolean},
      bruises: {type: Boolean},
      stringOrBites: {type: Boolean},
      considerableInjuries: {type: Boolean},
      rehabilitationTherapy: {type: Boolean},
      physicalTraumasAreas: {type: [String],
                            enum: ['Cabeza(Craneo,cara)', 'Cuello', 'Tronco(zona dorsal, pectoral, abdominal, perineal)', 'miembros superiores(deltoide, brazo, codo, antebrazo, mano,)', 'miembro inferiores(gluteo, muslo, rodilla, pierna, pie)']},
      physicalType: {type: Boolean},
      pyschologicalTrauma : {type: Boolean}
    }, // **Cierre Trauma**

    Hospitalizations: {
      isBeenHospitalizes : {type: Boolean},
      times : {type: Number},
      HospitalizationType :  {type: [String],
                            enum: ['medicamentos', 'respiratorias', 'alimentarias', 'cutaneas', 'otro']}, //MODIFICAR
      bloodType: {type: [String],
                        enum: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']},
     bloodTransfer: {type: Boolean},
     allergies: {type: [String],
                enum: ['medicamentos', 'respiratorias', 'alimentarias', 'cutaneas', 'otro']},
    drugAddiction: {type: Boolean},
    vaccineScheme: {type: Boolean}

    }, // **Cierre Hospitalization**

    Diseases: {
      enfInfectocontagiosas: {type: Boolean},
      infectoType: {type: [String],
                    enum: ['varicela', 'rubeola', 'sarampion', 'colera', 'influenza', 'fiebre tifoidea', 'otro', 'desconoce']},
      diabetes: {type: Boolean},
      diabetesType : {type: String,
                      enum : [ 'Tipo I', 'Tipo II', 'Otro']
                                },
      lungDisease : {type: Boolean},
      lungType : {type: [String],
                  enum: ['neumonia', 'asma', 'enfisema', 'EPOC', 'endema', 'otro']},
      kindneyDiseases : {type: String},
      kindneyType : {type: [String],
                    enum : ['insuficiencia renal', 'cálculos renales', 'nefropatias', 'otro']},
      liverDisease: {type: String},
      liverType: {type: [String],
                  enum : ['hepatitis A', 'hepatitis B', 'hepatitis C', 'cirrosis', 'nemocromatosis', 'otra']},
      convulsiones: {type: Boolean},
      cerebralPalsy: {type: [String],
                    enum: ['Extremidades superiores', 'Extremidades inferiores', 'facial', 'tipos mixtos', 'otro', 'desconoce']}
    }  // **Cierre Diseases**
  }, // ** Cierre Pathological **

  implantableMD:
  {
    dental: {type: Boolean},
    ocular: {type: Boolean},
    hearing: {type: Boolean},
    cosmetic: {type: Boolean},
    cranial: {type: Boolean},
    upperLimb: {type: Boolean},
    coloum: {type: Boolean},
    lowerLimb: {type: Boolean},
    vascular: {type: Boolean},
    cathers: {type: Boolean},
    cardiac: {type: Boolean}
  }, // ** Cierre implantableMD**

  noPathological:
  {
    diseasesFreq: {type: Number},
    sleepingHours: {type: Number},
    mealTimes: {type: Number},
    mealQuality: {type: Number},
    preventiveReviews: {type: Number},
    stressLevel: {type: Number},
    workoutsDays: {type: Number},
    sugaryDrinks: {type: Number},
    sexualLife: {type:Boolean},
    alcoholicDrinks: {type:Boolean},
    cigarettes: {type:Boolean},
    otherDrugs: {type:Boolean}
  }, // ** Cierre noPathological**



}); // Fin del ESQUEMA

module.exports = mongoose.model('MemberMedicalRecord', MemberMedicalRecord);
