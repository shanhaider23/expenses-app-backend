const mongoose =require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        minLength: 5
    },
    name: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true,
        minLength: 5
    },
    expenses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Expense'
        }
    ]
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User