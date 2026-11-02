const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    assignedTo: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: true,
      enum: ["High", "Medium", "Low"],
    },
    status: {
      type: String,
      required: true,
      enum: ["Todo", "In Progress", "Done"],
    },
    dueDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);