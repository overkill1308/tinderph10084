const mongoose = require('mongoose')
const UserSchema = new  mongoose.Schema({
    avatar: {
        type: 'String',
    },
    fullname: {
        type: 'String',
    },
    date: {
        type: 'String',
    },
    gender: {
        type: 'String',
    },
    hobbies: {
        type: 'String',
    },
    phone: {
        type: 'String',
    },
    password: {
        type: 'String',
    },
    description: {
        type: 'String',
    }
})
const User = mongoose.model('User', UserSchema)
module.exports = User