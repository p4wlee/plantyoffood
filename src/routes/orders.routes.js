// importazione di express e creazione del router
const express = require("express");
const router = express.Router();

// importazione dei controller degli ordini
const ordersController = require("../controllers/orders.controller");

// definizione delle rotte degli ordini (CRUD)
router.post("/", ordersController.createOrder);
router.get("/", ordersController.getOrders);
router.delete("/:id", ordersController.deleteOrder);

// rotte per gestire l'associazione tra ordini e utenti
router.post("/:id/users", ordersController.addUserToOrder);
router.delete("/:id/users/userID", ordersController.removeUserFromOrder);

// rotte per gestire l'associazione tra ordini e prodotti
router.post("/:id/products", ordersController.addProductToOrder);
router.delete("/:id/products/productID", ordersController.removeProductFromOrder);

// esportazione del router
module.exports = router;
