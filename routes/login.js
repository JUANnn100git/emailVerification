// Requires
var express = require('express');
var crypto = require('crypto');
var nodemailer = require('nodemailer');

// Inicializar variables
var app = express();

// Importar modelo de Usuario
var User =  require('../models/user');
var Token =  require('../models/token');

const { check, validationResult } = require('express-validator');

/**
* POST /login
* Sign in with email and password
*/
exports.loginPost = function(req, res, next) {
    check('email', 'Email is not valid').isEmail();
    check('email', 'Email cannot be blank').not().isEmpty();
    check('password', 'Password cannot be blank').not().isEmpty();

    // Check for validation error
    var errors = validationResult(req);
    if (errors) return res.status(400).send(errors);

    User.findOne({ email: req.body.email }, function(err1, user) {
        
        if(err1) return res.status(500).send({msg: 'Error'});
        
        if (!user) return res.status(401).send({ msg: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'});

        user.comparePassword(req.body.password, function (err2, isMatch) {
            if(err2) return res.status(500).send({msg: 'Error'});
            if (!isMatch) return res.status(401).send({ msg: 'Invalid email or password' });

            // Make sure the user has been verified
            if (!user.isVerified) return res.status(401).send({ type: 'not-verified', msg: 'Your account has not been verified.' }); 

            // Login successful, write token, and send back user
            res.send({ token: generateToken(user), user: user.toJSON() });
        });
    });
};



/**
* POST /signup
*/
exports.signupPost = function(req, res, next) {
    
  var body = req.body;

  // Make sure this account doesn't already exist
  User.findOne({ email: body.email }, function (err, user) {
      
      if(err) return res.status(500).send({msg: 'Error'});

    // Make sure user doesn't already exist
    if (user) return res.status(400).send({ msg: 'The email address you have entered is already associated with another account.' });

    // Create and save the user
    user = new User({ name: body.name, email: body.email, password: body.password });
    user.save(function (err) {
        if (err) { return res.status(500).send({ msg: err.message }); }

        // Create a verification token for this user
        var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

        // Save the verification token
        token.save(function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }

            // Send the email
            var transporter = nodemailer.createTransport({ 
                host: "mail.dharma-consulting.com",
                port: 465,
                secure: true,
                auth: { 
                    user: process.env.JUSTHOST_USERNAME,
                    pass: process.env.JUSTHOST_PASSWORD
                } 
            });

            var mailOptions = { 
                from: '"DharmaPro 👻" <admin@dharma-consulting.com>',
                to: 'jvillanueva@dharma-consulting.com', // user.email
                subject: 'Account Verification Token',
                text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' 
            };

            transporter.sendMail(mailOptions, function (err) {
                if (err) { 
                    return res.status(500).send({ msg: err.message }); 
                }

                res.status(200).send('A verification email has been sent to ' + user.email + '.');
            });
        });
    });
  });
};

/**
* POST /confirmation
*/
exports.confirmationPost = function (req, res, next) {
    
    var token = req.params.token || 'nulo';
    var email = 'jvillanueva@gmail.com';

    // Find a matching token
    Token.findOne( {token: token}, function (err, token) {
        
        if(err) return res.status(500).send({msg: 'Error'});

        if (!token) return res.status(400).send({ 
            type: 'not-verified', 
            msg: 'We were unable to find a valid token. Your token my have expired.',
            token: token
        });

        // If we found a token, find a matching user
        User.findOne({ _id: token._userId, email: email }, function (err, user) {
            if (!user) return res.status(400).send({
                 msg: 'We were unable to find a user for this token.' }
                 
                 );
            if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });

            // Verify and save the user
            user.isVerified = true;
            user.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send("The account has been verified. Please log in.");
            });
        });
    });
};
