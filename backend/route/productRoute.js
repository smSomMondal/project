import express from "express";
import { addProduct, deleteProduct, updateProduct, getProduct, getProductList, getProductInfo } from "../controller/productController.js";
import { chqSeler } from "../middleware/userMiddleware.js";

const productApi = express.Router();

productApi.post("/addProduct",chqSeler,addProduct);
productApi.post("/updateProduct",chqSeler, updateProduct);
productApi.put("/getProduct",chqSeler, getProduct);
productApi.put("/getProductInfo",chqSeler, getProductInfo);
productApi.put("/getProductUser",getProductList);
productApi.post("/deleteProduct",chqSeler, deleteProduct);

export default productApi;
/*
const express = require("express");
const { createProduct, getProducts } = require("../controller/productController");
const router = express.Router();

router.post("/add", createProduct);
router.get("/", getProducts);

module.exports = router;
*/