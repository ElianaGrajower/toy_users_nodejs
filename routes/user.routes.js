const express = require("express");
const authControllers = require("../controllers/auth.controllers");
const Joi = require("joi");
const userControllers = require("../controllers/user.controllers");

const router = express.Router();


router.route("/").post(userControllers.register);
router.route("/login").post(userControllers.login);
router.route("/:id").get( userControllers.getUserById);
router.route("/").get( userControllers.getUsers);

module.exports = router;
