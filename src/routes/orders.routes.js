// importazione di express e creazione del router
const express = require("express");
const router = express.Router();

// importazione dei controller degli ordini
const ordersController = require("../controllers/orders.controller");

// definizione delle rotte degli ordini (CRUD)

// rotte CRUD base
router.post("/", ordersController.createOrder);
router.get("/", ordersController.getOrders);

// rotta per ottenere un ordine specifico tramite il suo ID
router.get("/:orderId", ordersController.getOrderById);
// rotta per ottenere tutti gli utenti associati a un ordine specifico
router.get("/:orderId/users", ordersController.getUsersOfOrder);
router.delete("/:orderId", ordersController.deleteOrder);

// rotte per gestire l'associazione tra ordini e utenti
router.post("/:orderId/users/:userId", ordersController.addUserToOrder);
router.delete("/:orderId/users/:userId", ordersController.removeUserFromOrder);

// rotte per gestire l'associazione tra ordini e prodotti
router.post("/:orderId/products/:productId", ordersController.addProductToOrder);
router.delete("/:orderId/products/:productId", ordersController.removeProductFromOrder);

// esportazione del router
module.exports = router;
