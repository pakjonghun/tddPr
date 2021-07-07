const express = require('express');
const productRouter = express.Router()
const {createProduct,readProduct, readDetail, updateProduct} = require("./controllers/productController")

productRouter.post("/",createProduct)

productRouter.get("/",readProduct)

productRouter.get("/:id",readDetail)

productRouter.patch("/:id",updateProduct)

module.exports = productRouter;