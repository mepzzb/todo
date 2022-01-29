const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const validateRegisterInput = require('../validation/registerValidation')
const jwt = require('jsonwebtoken')
const requiresAuth = require('../middleware/permissions')

router.post('/register', async (req, res) => {
  try {
    const { errors, isValid } = validateRegisterInput(req.body)

    if (!isValid) {
      return res.status(400).json({ errors })
    }

    const existingEmail = await User.findOne({ email: req.body.email })

    if (existingEmail) {
      return res.status(400).json({ error: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12)
    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name
    })
    const savedUser = await newUser.save()

    const payload = { userId: savedUser._id }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1d'
    })

    const userToReturn = { ...savedUser._doc }
    delete userToReturn.password;

    return res.json({
      token,
      user: userToReturn
    })
  } catch (e) {
    console.log(e)
    res.status(500).send(e.message)
  }
})

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    const passwordMatch = await bcrypt.compare(req.body.password, user.password)

    if (!passwordMatch) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    const payload = { userId: user._id }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1d'
    })

    const userToReturn = { ...user._doc }
    delete userToReturn.password

    return res.json({
      token,
      user: userToReturn
    })
  } catch (e) {
    console.log(e)
    res.status(500).send(e.message)
  }
})

router.get('/current', requiresAuth, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  return res.json(req.user)
})

module.exports = router
