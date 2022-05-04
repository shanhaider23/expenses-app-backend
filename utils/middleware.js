const tokenExtractor = (request, response, next) => {
    const authorization = request.get('Authorization')
    if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token = authorization.substring(7)
    }
    next()
}

module.exports = { tokenExtractor }