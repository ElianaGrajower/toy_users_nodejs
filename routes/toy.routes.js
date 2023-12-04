const express = require("express");
const toyControllers = require("../controllers/toy.controllers");
const authControllers = require("../controllers/auth.controllers");
const router = express.Router();


router.get("/", toyControllers.getToys);
router.get("/search", toyControllers.getBySearch);
router.get("/category/:catname", toyControllers.getByCategory);
router.get("/prices", toyControllers.getByPrice);
router.get("/single/:id", toyControllers.getSingle);
router.post("/", authControllers.isLoggedIn, toyControllers.addNewToy);
router.put("/:editId", authControllers.isLoggedIn, toyControllers.editToy);
router.delete("/:delId", authControllers.isLoggedIn, toyControllers.deleteToy);


module.exports = router;
