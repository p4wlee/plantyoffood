// importazione di express e creazione del router
const express = require("express");
const router = express.Router();

// importazione dei controller degli utenti
const usersControllers = require("../controllers/users.controller");

// importazione dei middleware di validazione degli utenti
const { validateUserCreate, validateUserUpdate } = require("../middleware/validators/users.validators");

// definizione delle rotte degli utenti (CRUD)
router.post("/", validateUserCreate, usersControllers.createUser);
router.get("/", usersControllers.getUsers);
router.get("/:id", usersControllers.getUserById);
router.put("/:id", validateUserUpdate, usersControllers.updateUser);
router.delete("/:id", usersControllers.deleteUser);

// esportazione del router
module.exports = router;
