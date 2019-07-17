// Requires
const express = require('express')
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables de Express
const app = express()

// Declarar Variable Globales
var serverPort = 3300;
var urlDB = 'mongodb+srv://emailVerification_user:JVuWWPjj48PvTlna@cluster0-fmnnc.mongodb.net/emailVerification?retryWrites=true&w=majority';

// Body Parser: parse application/x-www-form-urlencoded & application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Importar Rutas
var loginController = require('./routes/login');

// Conexión a la base de datos
mongoose.connect(urlDB, { useNewUrlParser: true, useCreateIndex: true,  useFindAndModify: false }, (err, res) => {
    if( err ) throw err;
    console.log('\x1b[32m\x1b[36m' + 'Base de datos:\x1b[32m\x1b[93m', 'Online');
});

// Rutas
app.use('/login', loginController.loginPost);
app.use('/register', loginController.signupPost);


// Última Ruta
app.get('/', function (req, res) {
  res.send('Hello World')
})
 
// Escuchar peticiones
app.listen(serverPort, () => {
    console.log('\x1b[32m\x1b[36m' + 'Express server en puerto \x1b[32m\x1b[91m'+ serverPort + '\x1b[32m\x1b[36m:\x1b[32m\x1b[93m', 'Online');
});
