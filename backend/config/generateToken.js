const jwt = require('jsonwebtoken')

const secret = "ayush"

const generateToken = (id) => {
  return jwt.sign({ id }, secret, {
    expiresIn: "30d",
  })
}


module.exports = generateToken;