import express from 'express';
import { adminCheck, requireSignIn } from '../middlewares/authMiddleware.js';
import { allCategoryController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from '../controller/categoryController.js';

const router = express.Router();

// All the routes here are saved for the Food Category to be added or deleted or updated and also to get all the food category 

// http://localhost:5000/api/v1/category/create-category
router.post('/create-category', requireSignIn, adminCheck, createCategoryController);

// http://localhost:5000/api/v1/category/update-category/:id
router.put('/update-category/:id', requireSignIn, adminCheck, updateCategoryController);

// http://localhost:5000/api/v1/category/all-category
router.get("/all-category", allCategoryController);

// http://localhost:5000/api/v1/category/single-category/:slug
router.get("/single-category/:slug", singleCategoryController);

// http://localhost:5000/api/v1/category/delete-category/:id
router.delete("/delete-category/:id", requireSignIn, adminCheck, deleteCategoryController);



export default router