const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const validateRegisterInput = require('../validation/registerValidation')

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
    return res.json(savedUser)
  } catch (e) {
    console.log(e)
    res.status(500).send(e.message)
  }
})

module.exports = router