import express from "express";
import { adminCheck, requireSignIn } from '../middlewares/authMiddleware.js';
import { allProductController, createProductController, deleteProductController, filterProductController, paymentController, paymentTokenController, photoProductController, productCategoryController, searchProductController, similarProductController, singleProductController, updateProductController } from "../controller/productController.js";
import formidable from "express-formidable";


const router = express.Router();

// Here we will include all the routes to add our products to the website

// Creating a New Product

// http://localhost:5000/api/v1/product/create-product
router.post("/create-product",
    requireSignIn,
    adminCheck,
    formidable(),
    createProductController);

// Updating an existing Product

// http://localhost:5000/api/v1/product/update-product/:pid
router.put("/update-product/:pid",
    requireSignIn,
    adminCheck,
    formidable(),
    updateProductController);

// Deleting an existing Product

// http://localhost:5000/api/v1/product/delete-product/:pid
router.delete("/delete-product/:pid", requireSignIn, adminCheck, deleteProductController);

// Get All the Products without the Image

// http://localhost:5000/api/v1/product/all-product
router.get("/all-product", allProductController);

// Get the Single Product without the Image

// http://localhost:5000/api/v1/product/single-product/:slug
router.get("/single-product/:slug", singleProductController);

// Get Only the Image

// http://localhost:5000/api/v1/product/photo-product/:pid
router.get("/photo-product/:pid", photoProductController);

// Filter the Products as per category or price

// http://localhost:5000/api/v1/product/filter-product
router.post("/filter-product", filterProductController);

// Filter all the products as it is searched

// http://localhost:5000/api/v1/product/search-product/:keywords
router.get('/search-product/:keywords', searchProductController);

// Show the similar products to that category in the single page details

// http://localhost:5000/api/v1/product/similar-product/:pid/:cid
router.get("/similar-product/:pid/:cid", similarProductController);

// Show only the category that is selected in the Navbar Menu

// http://localhost:5000/api/v1/product/product-category/:slug
router.get("/product-category/:slug", productCategoryController);

// We will receive the Client Tokens from Braintree for payments

// http://localhost:5000/api/v1/product/braintree/tokens
router.get("/braintree/tokens", paymentTokenController);

// We will do the functionalitites from Braintree for payments

// http://localhost:5000/api/v1/product/braintree/payment
router.post("/braintree/payment", requireSignIn, paymentController);


export default router;