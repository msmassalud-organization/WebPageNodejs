'use-strict'
/*
  Module dependencies
*/

const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const app = express()
const path = require('path')
const passport = require('passport')
const session = require('express-session')
const config = require('./config')
const flash = require('connect-flash')


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

//Configuramos la herramienta para parsear las cookies
app.use(cookieParser());

//Configuración de Passport para autenticación
require('./middlewares/passport')(passport);
app.use(session({ secret: config.SECRET_TOKEN }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//configurar rutas
require('./routes.js')(app, passport);

//Not Found
app.use(function(req, res, next){
  res.status(404);
  res.render('pages/404', { url: req.url });
});

module.exports = app
