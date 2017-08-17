'use-strict'
/*
  Module dependencies
*/

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const path = require('path')
const auth = require('./middlewares/auth')
const userController = require('./controllers/user');
console.log(userController);
//Establecemos la ruta de la carpeta de vistas
app.set('views', __dirname + '/views');

//Definimos que utilizaremos 'ejs' como motor para visualización
app.set('view engine', 'ejs');

//Colocamos la carpeta 'public' visible en las direcciones
app.use(express.static(__dirname + '/public'));

//Configuramos una herramienta para parsear información en formato JSON
app.use(bodyParser.json());

//Configuramos una herramienta para parsear información del método POST
app.use(bodyParser.urlencoded({
  extended: false
}));

app.get('/', userController.getAllUsers);
app.get('/signupMember', (req, res) =>{
  res.status(200).render('pages/signupMember');
});
app.post('/signupMember', userController.insertMember);
app.get('/signin', (req, res) =>{
  res.status(200).render('pages/signin');
});
app.post('/signin', userController.signIn);

app.get('/findMembers', (req, res) =>{
  res.status(200).render('pages/findMembers');
});
app.get('/getMembersByName', userController.getMembersByName);
app.post('/loadProfile', userController.loadMemberProfile);
app.get('/loadProfile', (req, res) =>{
  res.status(403).render('pages/403');
});

app.get('/private', auth,(req, res)=>{
  res.status(200).send({message: 'Tienes acceso.'});
});
//Not Found
app.use(function(req, res, next){
  res.status(404);
  res.render('pages/404', { url: req.url });
});

module.exports = app
