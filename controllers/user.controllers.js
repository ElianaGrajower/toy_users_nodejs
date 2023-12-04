const bcrypt = require("bcryptjs");
const Joi = require("joi");
const { User } = require("../models/User.model");
const { generateToken } = require("../utils/jwt");
const asyncWrap = require("./../utils/asyncWrapper");
const AppError = require("../utils/AppError");

const userJoiSchema = {
    login: Joi.object().keys({
        password: Joi.string(),
        email: Joi.string()
            .email({ tlds: { allow: ["com"] } })
            .error(() => Error("Email is not valid")),
    }),
    register: Joi.object().keys({
        password: Joi.string().max(20).required(),
        email: Joi.string()
            .email({ tlds: { allow: ["com"] } })
            .error(() => Error("Email is not valid"))
            .required(),
        name: Joi.string().required(),
        date_create: Joi.date(),
        role: Joi.string()
    }),
};


exports.register = asyncWrap(async (req, res, next) => {
    const body = req.body;
    console.log(body);
    const validate = userJoiSchema.register.validate(body);
    if (validate.error) {
        throw Error(validate.error);
    }

    if (await checkIfUserExists(body.email)) {
        throw new Error("Already in the system");
    };

    const hash = await bcrypt.hash(body.password, 10);
    body.password = hash;

    const newUser = new User(body);
    
    await newUser.save();

    console.log(newUser);

    res.status(201).send(newUser);
});

const checkIfUserExists = async (email) => {
    const user = await User.findOne({ email });
    if (user) return user;
    return false;
}

exports.getUserById = asyncWrap(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) return next(new AppError(400, "user not exist"));
    res.status(200).json({
        status: "success",
        user,
    });
});

exports.login = asyncWrap(async (req, res, next) => {
    const body = req.body;

    const validate = userJoiSchema.login.validate(body);
    if (validate.error) {
        return next(new AppError(401, validate.error.message));
    }

    //check is user exists
    const user = await checkIfUserExists(body.email);
    // if exsits check if password match
    if (!user || !bcrypt.compare(body.password, user.password)) {
        return next(new AppError(401, "Password or email not valid"));
    }
    // generates jwt token
    const token = generateToken(user);
    res.send({ user, token });
});


exports.getUsers = asyncWrap(async (req, res, next) => {
    const users = await User.find();
    res.send(users);
});