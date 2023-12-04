const asyncWrap = require("../utils/asyncWrapper");
const { decodeToken } = require("../utils/jwt");
const AppError = require("./../utils/AppError");
const { User } = require("../models/User.model");

exports.isLoggedIn = asyncWrap(async (req, res, next) => {
    // if (!req.headers.cookie.startsWith("jwt"))
    //     return next(new AppError(403, "Please login"));
    // const token = req.headers.cookie.split("=")[1];
    //const token = req.headers["authorization"];
    //?
    let token = req.headers["authorization"];

    if (!token) return res.sendStatus(401);
    token = token.split(" ")[1];
    //? 

    if (!token) return next(new AppError(401, "Please login"));

    const payload = decodeToken(token);
    const id = payload._doc.id;
    console.log(id);
    const user = await User.findById(id);
    if (!user) return next(new AppError(403, "Please login"));
    req.user = user;
    console.log(req.user);
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'premium']. role='user'
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(403, "You do not have permission to perform this action")
            );
        }
        next();
    };
};