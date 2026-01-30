// importazione di express e creazione del router
const express = require("express");
const router = express.Router();

// importazione dei controller dei prodotti
const productsController = require("../controllers/products.controller");

// definizione delle rotte dei prodotti (CRUD)
router.post("/", productsController.createProduct);
router.get("/", productsController.getAllProducts);
router.get("/:id", productsController.getProductById);
router.put("/:id", productsController.updateProduct);
router.delete("/:id", productsController.deleteProduct);

// esportazione del router
module.exports = router;
