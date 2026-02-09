// importazione di express e creazione del router
const express = require("express");
const router = express.Router();

// importazione dei controller dei prodotti
const productsController = require("../controllers/products.controller");

// importazione dei middleware di validazione dei prodotti
const { validateProductCreate, validateProductUpdate } = require("../middleware/validators/products.validators");

// definizione delle rotte dei prodotti (CRUD)
router.post("/", validateProductCreate, productsController.createProduct);
router.get("/", productsController.getAllProducts);
router.get("/:id", productsController.getProductById);
router.put("/:id", validateProductUpdate, productsController.updateProduct);
router.delete("/:id", productsController.deleteProduct);

// esportazione del router
module.exports = router;
