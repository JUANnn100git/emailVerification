var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    roles: [{ type: 'String' }],
    isVerified: { type: Boolean, default: false },
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date
});

module.exports = mongoose.model('User', userSchema);