// importazione di express e creazione del router
const express = require("express");
const router = express.Router();

// importazione dei controller degli ordini
const ordersController = require("../controllers/orders.controller");

// implementazione dei middleware di validazione
const { validateOrderIdParam, validateUserIdParam, validateProductIdParam, validateOrderFilter } = require("../middleware/validators/orders.validators");

// definizione delle rotte degli ordini (CRUD)

// rotte CRUD base
router.post("/", ordersController.createOrder);
router.get("/", validateOrderFilter, ordersController.getOrders);

// rotta per ottenere un ordine specifico tramite il suo ID
router.get("/:orderId", validateOrderIdParam, ordersController.getOrderById);
// rotta per ottenere tutti gli utenti associati a un ordine specifico
router.get("/:orderId/users", validateOrderIdParam, ordersController.getUsersOfOrder);
// rotta per ottenere tutti i prodotti associati a un ordine specifico
router.get("/:orderId/products", validateOrderIdParam, ordersController.getProductsOfOrder);
// rotta per eliminare un ordine specifico tramite il suo ID
router.delete("/:orderId", validateOrderIdParam, ordersController.deleteOrder);

// rotte per gestire l'associazione tra ordini e utenti
router.post("/:orderId/users/:userId", validateOrderIdParam, validateUserIdParam, ordersController.addUserToOrder);
router.delete("/:orderId/users/:userId", validateOrderIdParam, validateUserIdParam, ordersController.removeUserFromOrder);

// rotte per gestire l'associazione tra ordini e prodotti
router.post("/:orderId/products/:productId", validateOrderIdParam, validateProductIdParam, ordersController.addProductToOrder);
router.delete("/:orderId/products/:productId", validateOrderIdParam, validateProductIdParam, ordersController.removeProductFromOrder);

// esportazione del router
module.exports = router;
