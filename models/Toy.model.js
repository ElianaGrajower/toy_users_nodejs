const mongoose = require("mongoose");

const toySchema = new mongoose.Schema({
    id: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    info: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: false,
    },
    img_url: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: false,
    },
    date_created: {
      type: Date,
      required: false,
    },
    user_id: {

        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
  });

  toySchema.pre("save", function (next) {
    this.id = String(this._id);
    next();
  });

  const Task = mongoose.model("Task", toySchema);
  module.exports = Task;
  