const User = require('../models/User')
const jwt = require('jsonwebtoken')

const requiresAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const { userId } = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(userId)
    const userToReturn = { ...user._doc }
    delete userToReturn.password
    req.user = userToReturn
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}

module.exports = requiresAuth