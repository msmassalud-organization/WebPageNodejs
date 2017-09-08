'use strict'
const config = require('../config.js')

module.exports = {
  getEventDescription: (type, user)=>{
    let description = config.systemEventStrings[type];
    if(description == undefined){
      description = `Event[${type}] is not defined`;
    }else{
      let fecha = new Date().toISOString();
      description = `[${fecha}]::${user.fullName} <${description}>`;
    }
    return description;
  }
}
