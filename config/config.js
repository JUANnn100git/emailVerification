// =========================================
// Variables Globales
// =========================================

// =========================================
// Puerto
// =========================================
process.env.PORT = process.env.PORT || 3300;

// =========================================
// Entorno
// =========================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =========================================
// Base de Datos
// =========================================
let urlDB;

if ( process.env.NODE_ENV === 'dev' ) {
    urlDB = process.env.MONGO_URI || 'mongodb+srv://emailVerification_user:JVuWWPjj48PvTlna@cluster0-fmnnc.mongodb.net/emailVerification?retryWrites=true&w=majority';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// =========================================
// Servidor de Correo
// =========================================

process.env.JUSTHOST_USERNAME = 'jvillanueva@dharma-consulting.com';
process.env.JUSTHOST_PASSWORD = 'dc*2014';