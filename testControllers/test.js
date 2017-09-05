'use strict'

module.exports = {
  test : (req, res) =>{
    console.log(req.body);
    console.log(req.body.vehicle);
    res.status(200).send(req.body);
  },
  loadTest: (req, res) =>{
    res.status(200).render('pages/test');
  }
}
