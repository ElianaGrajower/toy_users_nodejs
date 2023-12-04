const validator = require("validator");

const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    id: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: [true, 'first name is required']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: "The email is not correct",
        },
    },
    password: {
        type: String,
        required: true,
    },
    date_created: {
        type: Date,
        default: new Date(),
        required: true,
    },
    role: {
        type: String,
        enum: {
            values: ["admin", "user"],
            message: "the value must be either 'admin','user'",
        },
        default: "user",
    },
});

userSchema.pre("save", function (next) {
    console.log(this);
    this.id = String(this._id);
    next();
});

const User = model("User", userSchema);
module.exports.User = User;