const express = require('express')
const router = express.Router()
const ToDo = require('../models/ToDo')
const requiresAuth = require('../middleware/permissions')
const validateToDoInput = require('../validation/toDoValidation')

router.post('/new', requiresAuth, async (req, res) => {
  try {
    const { isValid, errors } = validateToDoInput(req.body)

    if (!isValid) {
      return res.status(400).json({ errors })
    }

    const newToDo = new ToDo({
      user: req.user._id,
      content: req.body.content
    })

    await newToDo.save()

    return res.json(newToDo)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Unknown error' })
  }
})

router.get('/current', requiresAuth, async (req, res) => {
  try {
    const completedToDos = await ToDo.find({ user: req.user._id, complete: true }).sort(({ completedAt: -1 }))
    const incompletedToDos = await ToDo.find({ user: req.user._id, complete: false }).sort(({ createdAt: -1 }))
    return res.json({
      incomplete: incompletedToDos,
      complete: completedToDos
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Unknown error' })
  }
})

module.exports = router