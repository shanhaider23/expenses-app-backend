const expensesRouter = require('express').Router()
const Expense = require('../models/expense')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

//Getting all
expensesRouter.get('/', async(request, response) => {
    try {
        const expenses = await Expense.find({}).populate('user', {username: 1, name: 1})
        //populating user - 'user' is a field in Expense model.
        response.json(expenses.map(expense => expense.toJSON()))
    } 
    catch(error) {
        response.status(500).json({message: error.message})
    }
})

//Getting one
expensesRouter.get('/:id', getExpense, (request, response) => {
    response.json(response.expense)
})

//Creating one
expensesRouter.post('/', async(request, response, next) => {
    const body = request.body
    
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if(!request.token || !decodedToken.id) {
        return response.status(401).json({error: 'Token missing or invalid'})
    }

    const user = await User.findById(decodedToken.id)

    const newExpense = new Expense({
        expense_name: body.expense_name,
        date: body.date,
        members: body.members,
        expenses: body.expenses,
        splitted: body.splitted,
        user: user._id
    })
    
    try {
        const savedExpense = await newExpense.save()
        user.expenses = user.expenses.concat(savedExpense._id)
        await user.save()
        response.status(201).json(savedExpense)
    } 
    catch(exception) {
        next(exception)
    }
})

//updating one
expensesRouter.patch('/:id', getExpense, async(request, response, next) => {
    const body = request.body

    if(body.expense_name != null)
        response.expense.expense_name = body.expense_name
    try {
        const updatedExpense = await response.expense.save()
        response.json(updatedExpense)
    } 
    catch(exception) {
        next(exception)
    }
})

//Deleting one
expensesRouter.delete('/:id', getExpense, async(request, response, next) => {
    try{
        await response.expense.remove()
        response.json({message: 'Deleted Expense'})
    } 
    catch(exception) {
        next(exception)
    }
})

async function getExpense(request, response, next) {
    const decodedToken = jwt.verify(request.token, process.env.SECRET) 
    let expense
    try {
        const user = await User.findById(decodedToken.id)   
        expense = await Expense.findById(request.params.id)
        
        if(expense.user.toString() === user.id.toString()) {
            response.expense = expense
        }
        else
            return response.status(404).json({message: 'Cannot find Expense'})
    } 
    catch(error) {
        next(exception)
    } 
    next()
}
 
module.exports = expensesRouter