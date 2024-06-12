import slugify from "slugify";
import FoodCategory from "../models/categoryModal.js";

export const createCategoryController = async (req, res) => {
    try {
        // We need to take the name and if it snot mentiuoned then report
        const { name } = req.body;
        if (!name) {
            return res.status(401).send({
                message: "Name is required",
            });
        };

        // We got to check if there is any existing category with the same name so that there is no duplication

        const existingCategory = await FoodCategory.findOne({ name });

        if (existingCategory) {
            return res.status(200).send({
                success: true,
                message: "Category Already Exists"
            });
        };

        const category = await new FoodCategory({ name, slug: slugify(name) }).save();

        res.status(201).send({
            success: true,
            category,
            message: "New Category Created Succesfully",
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error while creating a Category"
        });
    }
};

// Update Category Controller 

export const updateCategoryController = async (req, res) => {
    try {

        const { name } = req.body;
        const { id } = req.params;

        const putCategory = await FoodCategory.findByIdAndUpdate(
            id,
            { name, slug: slugify(name) },
            // Whenever we update a category we need to use this object
            { new: true },
        );

        res.status(200).send({
            success: true,
            message: "Category Updated successfully",
            putCategory,
        });

    } catch (error) {
        console.log(error),
            res.status(500).send({
                success: false,
                message: "Error while updating Category",
                error,
            })
    }
};

// We use this to call all the categories we have in our database

export const allCategoryController = async (req, res) => {
    try {
        const allCategory = await FoodCategory.find({});
        res.status(200).send({
            success: true,
            allCategory,
            message: "Here are all the Categories"
        });

    } catch (error) {
        console.log(error),
            res.status(500).send({
                success: false,
                error,
                message: "Error in showing all Category",
            });
    }
};

// This is used to only call one single or specific category that we have 

export const singleCategoryController = async (req, res) => {
    try {
        const { slug } = req.params;

        const oneCategory = await FoodCategory.findOne({ slug: slug });

        res.status(200).send({
            success: true,
            message: "Got a single-Category Successfully",
            oneCategory,
        });

    } catch (error) {
        console.log(error),
            res.status(500).send({
                success: false,
                error,
                message: "Error to show the signle Category",
            })
    }
};

// Delete Category that is specified by ID

export const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params;

        await FoodCategory.findByIdAndDelete(id);

        res.status(200).send({
            success: true,
            message: "Category Deleted Successfully",
        });
    } catch (error) {
        console.log(error),
            res.status(500).send({
                success: false,
                error,
                message: "Error in deleting Category",
            })
    }
};