const mongoose = require('mongoose')

const expenseSchema = mongoose.Schema({
    expense_name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    members: [
        {
        name: String,
        isChecked: Boolean
        },
    ],
    expenses: [
        {
            amount: Number,
            by_whom: String,
            to_whom: [
                {
                    name: String,
                    isChecked: Boolean
                },
            ]
        },
    ],
    splitted: [
        {
            member: String,
            splittedExp: [
                {
                    to: String,
                    amount: Number
                },
            ]
        },
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

expenseSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Expense = mongoose.model('Expense', expenseSchema)

module.exports = Expense