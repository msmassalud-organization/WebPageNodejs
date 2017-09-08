'use strict'
const twilio = require('twilio')
const config = require('../config')
module.exports = {
  test: (req, res) => {
    console.log(req.body);
    console.log(req.body.vehicle);
    res.status(200).send(req.body);
  },
  loadTest: (req, res) => {
    res.status(200).render('pages/test');
  },

  twilioTest: (req,res) => {
    /*var client = new twilio(config.twilio.A_SID, config.twilio.AUTH_TOKEN);
    client.messages.create({
      //to: '+523311073939',
      to: '+523315450207',
      from: config.twilio.NUMBER,
      body: 'Holi desde MS + Salud! :3 :D (>w<)'
    }, (err, message) => {
      if (!err) {
        // The second argument to the callback will contain the information
        // sent back by Twilio for the request. In this case, it is the
        // information about the text messsage you just sent:
        console.log('Success! The SID for this SMS message is:');
        console.log(message.sid);

        console.log('Message sent on:');
        console.log(message.dateCreated);
        res.status(200).redirect('/');
      } else {
        console.log(err);
      }
    })*/
    res.send('Deshabilitado');
  }
}
