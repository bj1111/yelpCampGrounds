const mongoose = require('mongoose')
const passportlocalmongoose = require('passport-local-mongoose')

const UserSchema = new mongoose.Schema({
    Email: {
        type: String,
        required: true,
        unique: true
    }
})

UserSchema.plugin(passportlocalmongoose)

module.exports = mongoose.model('User', UserSchema)