// importazione di express e creazione del router
const express = require("express");
const router = express.Router();

// importazione dei controller degli utenti
const usersControllers = require("../controllers/users.controller");

// definizione delle rotte degli utenti (CRUD)
router.post("/", usersControllers.createUser);
router.get("/", usersControllers.getUsers);
router.get("/:id", usersControllers.getUserById);
router.put("/:id", usersControllers.updateUser);
router.delete("/:id", usersControllers.deleteUser);

// esportazione del router
module.exports = router;
