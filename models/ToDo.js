const { Schema, model } = require('mongoose')

const ToDoSchema = new Schema({
  content: { type: String, required: true },
  complete: { type: Boolean, default: false },
  completedAt: { type: Date },
  user: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

const ToDo = model('ToDo', ToDoSchema)
module.exports = ToDo