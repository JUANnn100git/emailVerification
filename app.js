// Requires
const express = require('express')
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables de Express
const app = express()

// Importar Variable Globales
require('./config/config');

// Body Parser: parse application/x-www-form-urlencoded & application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Importar Rutas
var loginController = require('./routes/login');

// Conexión a la base de datos
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true,  useFindAndModify: false }, (err, res) => {
    if( err ) throw err;
    console.log('\x1b[32m\x1b[36m' + 'Base de datos:\x1b[32m\x1b[93m', 'Online');
});

// Rutas
app.use('/login', loginController.loginPost);
app.use('/register', loginController.signupPost);
app.use('/confirmation/:token', loginController.confirmationPost);
// app.post('/resend', loginController.resendTokenPost);

// Última Ruta
app.get('/', function (req, res) {
  res.send('Hello World')
})
 
// Escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log('\x1b[32m\x1b[36m' + 'Express server en puerto \x1b[32m\x1b[91m'+ process.env.PORT + '\x1b[32m\x1b[36m:\x1b[32m\x1b[93m', 'Online');
});
