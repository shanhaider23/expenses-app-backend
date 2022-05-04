const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('expenses', {expense_name: 1, amount: 1, members: 1, by_whom: 1})

    //populating expenses-- 'expenses' is the field in User model. 

    response.json(users.map(user => user.toJSON()))
})

usersRouter.post('/', async (request, response) => {
    try {
        const body = request.body

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const newUser = new User({
            username: body.username,
            name: body.name,
            passwordHash
        })

        const savedUser = await newUser.save()
        response.status(201).json(savedUser)
    } 
    catch(exception) {
        next(exception)
    }
})

module.exports = usersRouter