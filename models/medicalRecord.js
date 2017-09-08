var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MemberMedicalRecord = new mongoose.Schema({

  relativeMR: // ***  Relative ***
  {
    dadRecord: // *** RECORD DAD ***
    {
      isAlive: {
        type: Boolean
      },
      diabetes: {
        type: Boolean
      },
      diabetesType: {
        type: String,
        enum: ['TIPO I', 'TIPO II', 'OTRO']
      },
      obesity: {
        type: Boolean
      },
      arthritis: {
        type: Boolean
      },
      hearthDisease: {
        type: Boolean
      },
      hearthType: {
        type: [String],
        enum: ['HIPERTENSION', 'HIPOTENSION', 'ISQUEMIA', 'ANGINA DE PECHO', 'INFARTO DE MIOCARDIO', 'MUERTE SUBITA', 'ENFERMEDAD NEUMATICA']
      },
      cancer: {
        type: Boolean
      },
      cancerType: {
        type: [String],
        enum: ['COLON Y RECTO', 'ENDOMÉTRICO', 'PROSTATA', 'MAMA', 'PULMÓN', 'LEUCEMIA', 'PANCREAS', 'TIROIDES', 'RIÑÓN', 'OTRO']
      },
      headache: {
        type: Boolean
      },
      lungDisease: {
        type: Boolean
      },
      lungType: {
        type: [String],
        enum: ['NEUMONIA', 'ASMA', 'ENFISEMA', 'EPOC', 'EDEMA', 'OTRO']
      },
      kindneyDiseases: {
        type: String
      },
      kindneyType: {
        type: [String],
        enum: ['INSUFICIENCIA RENAL', 'CÁLCULOS RENALES', 'NEFROPATÍAS', 'OTRO']
      },
      liverDisease: {
        type: String
      },
      liverType: {
        type: [String],
        enum: ['HEPATITIS A', 'HEPATITIS B', 'HEPATITIS C', 'CIRROSIS', 'NEMOCROMATOSIS', 'OTRO']
      }
    },
    // fin dadRecord

    momRecord: // *** RECORD MOM ***
    {
      isAlive: {
        type: Boolean
      },
      diabetes: {
        type: Boolean
      },
      diabetesType: {
        type: String,
        enum: ['Tipo I', 'Tipo II', 'Otro']
      },
      obesity: {
        type: Boolean
      },
      arthritis: {
        type: Boolean
      },
      hearthDisease: {
        type: Boolean
      },
      hearthType: {
        type: [String],
        enum: ['HIPERTENSIÓN', 'HIPOTENSIÓN', 'ISQUEMIA', 'ANGINA DE PECHO', 'INFARTO DE MIOCARDIO', 'MUERTE SUBITA', 'ENFERMEDAD NEUMATICA']
      },
      cancer: {
        type: Boolean
      },
      cancerType: {
        type: [String],
        enum: ['COLON Y RECTO', 'ENDOMÉTRICO', 'MAMA', 'PULMÓN', 'LEUCEMIA', 'PANCREAS', 'TIROIDES', 'RIÑÓN', 'OTRO']
      },
      headache: {
        type: Boolean
      },
      lungDisease: {
        type: Boolean
      },
      lungType: {
        type: [String],
        enum: ['NEUMONIA', 'ASMA', 'ENFISEMA', 'EPOC', 'EDEMA', 'OTRO']
      },
      kindneyDiseases: {
        type: String
      },
      kindneyType: {
        type: [String],
        enum: ['INSUFICIENCIA RENAL', 'CÁLCULOS RENALES', 'NEFROPATÍAS', 'OTRO']
      },
      liverDisease: {
        type: String
      },
      liverType: {
        type: [String],
        enum: ['HEPATITIS A', 'HEPATITIS B', 'HEPATITIS C', 'CIRROSIS', 'NEMOCROMATOSIS', 'OTRO']
      }
    },
    // fin momRecors



  }, // fin relativeMR

  pathological: //** Comienza Pathological **
  {
    Trauma: {
      sprains: {
        type: Boolean
      },
      dislocations: {
        type: Boolean
      },
      boneFracture: {
        type: Boolean
      },
      muscleStrain: {
        type: Boolean
      },
      bruises: {
        type: Boolean
      },
      stingsOrBites: {
        type: Boolean
      },
      considerableInjuries: {
        type: Boolean
      },
      rehabilitationTherapy: {
        type: Boolean
      },
      physicalTraumaAreas: {
        type: [String],
        enum: ['CABEZA(CRANEO,CARA)', 'CUELLO', 'TRONCO(ZONA DORSAL,PECTORAL,ABDOMINAL,PERINEAL)', 'MIEMBROS SUPERIORES(DELTOIDE, BRAZO, CODO, ANTEBRAZO, MANO,)', 'MIEMBRO INFERIORES(GLUTEO, MUSLO, RODILLA, PIERNA, PIE)']
      },
      pyschologicalTrauma: {
        type: Boolean
      }
    }, // **Cierre Trauma**

    Hospitalizations: {
      isBeenHospitalizes: {
        type: Boolean
      },
      times: {
        type: Number
      },
      hospitalizationType: {
        type: [String],
        enum: ['URGENCIAS', 'CUIDADOS INTENSIVOS', 'ENFERMEDADES O PATOLOGÍAS', 'CIRUGÍAS', 'OTRO']
      },
      bloodType: {
        type: String,
        enum: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']
      },
      bloodTransfer: {
        type: Boolean
      },
      allergies: {
        type: [String],
        enum: ['MEDICAMENTOS', 'RESPIRATORIAS', 'alimentarias', 'cutaneas', 'OTRO']
      },
      drugAddiction: {
        type: Boolean
      },
      vaccineScheme: {
        type: Boolean
      }

    }, // **Cierre Hospitalization**

    Diseases: {
      enfInfectocontagiosas: {
        type: Boolean
      },
      infectoType: {
        type: [String],
        enum: ['VARICELA', 'RUBEOLA', 'SARAMPIÓN', 'CÓLERA', 'INFLUENZA', 'FIEBRE TIFOIDEA', 'OTRO']
      },
      diabetes: {
        type: Boolean
      },
      diabetesType: {
        type: String,
        enum: ['Tipo I', 'Tipo II', 'Otro']
      },
      lungDisease: {
        type: Boolean
      },
      lungType: {
        type: [String],
        enum: ['NEUMONIA', 'ASMA', 'ENFISEMA', 'EPOC', 'EDEMA', 'OTRO']
      },
      kindneyDisease: {
        type: String
      },
      kindneyType: {
        type: [String],
        enum: ['INSUFICIENCIA RENAL', 'CÁLCULOS RENALES', 'NEFROPATÍAS', 'OTRO']
      },
      liverDisease: {
        type: String
      },
      liverType: {
        type: [String],
        enum: ['HEPATITIS A', 'HEPATITIS B', 'HEPATITIS C', 'CIRROSIS', 'NEMOCROMATOSIS', 'OTRO']
      },
      convulsiones: {
        type: Boolean
      },
      cerebralPalsy: {
        type: [String],
        enum: ['EXTREMIDADES SUPERIORES', 'EXTREMIDADES INFERIORES', 'FACIAL', 'TIPOS MIXTOS', 'OTRO']
      },
      hearthDisease: {
        type: Boolean
      },
      hearthType: {
        type: [String],
        enum: ['HIPERTENSION', 'HIPOTENSION', 'ISQUEMIA', 'ANGINA DE PECHO', 'INFARTO DE MIOCARDIO', 'MUERTE SUBITA', 'ENFERMEDAD NEUMATICA']
      },
      cancer: {
        type: Boolean
      },
      cancerType: {
        type: [String],
        enum: ['COLON Y RECTO', 'ENDOMÉTRICO', 'PROSTATA', 'MAMA', 'PULMÓN', 'LEUCEMIA', 'PANCREAS', 'TIROIDES', 'RIÑÓN', 'OTRO']
      },
    } // **Cierre Diseases**
  }, // ** Cierre Pathological **

  implantableMD: {
    dental: {
      type: Boolean
    },
    ocular: {
      type: Boolean
    },
    hearing: {
      type: Boolean
    },
    cosmetic: {
      type: Boolean
    },
    cranial: {
      type: Boolean
    },
    upperLimb: {
      type: Boolean
    },
    coloum: {
      type: Boolean
    },
    lowerLimb: {
      type: Boolean
    },
    vascular: {
      type: Boolean
    },
    cathers: {
      type: Boolean
    },
    cardiac: {
      type: Boolean
    }
  }, // ** Cierre implantableMD**

  noPathological: {
    diseasesFreq: {
      type: Number
    },
    sleepingHours: {
      type: Number
    },
    mealTimes: {
      type: Number
    },
    mealQuality: {
      type: Number
    },
    preventiveReviews: {
      type: Number
    },
    stressLevel: {
      type: Number
    },
    workoutsDays: {
      type: Number
    },
    sugaryDrinks: {
      type: Number
    },
    sexualLife: {
      type: Boolean
    },
    alcoholicDrinks: {
      type: Boolean
    },
    cigarettes: {
      type: Number
    },
    otherDrugs: {
      type: Boolean
    }
  }, // ** Cierre noPathological**



}); // Fin del ESQUEMA

module.exports = mongoose.model('MemberMedicalRecord', MemberMedicalRecord);
