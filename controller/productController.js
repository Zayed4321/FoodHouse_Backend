import fs from 'fs';
import FoodItem from '../models/productModel.js';
import slugify from 'slugify';
import FoodCategory from '../models/categoryModal.js';
import braintree from 'braintree';
import dotenv from 'dotenv';
import FoodOrder from '../models/orderModel.js';

dotenv.config();

var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.REACT_BRAINTREE_MERCHANT_ID,
    publicKey: process.env.REACT_BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.REACT_BRAINTREE_PRIVATE_KEY,
});

export const createProductController = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        // Proper Validation

        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" })
            case !description:
                return res.status(500).send({ error: "Description is Required" })
            case !price:
                return res.status(500).send({ error: "Price is Required" })
            case !category:
                return res.status(500).send({ error: "Category is Required" })
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" })
            case photo && photo.size > 1000000:
                return res.status(500).send({ error: "Image is Required and Needs to be less than 1mb" })
        };

        const products = new FoodItem({ ...req.fields, slug: slugify(name) });

        // As we took photo from req.files so we have to set the photo in the products.photo fields. Follow the steps below to add photo and it's type

        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        };

        await products.save();

        res.status(201).send({
            success: true,
            messsage: "New Product is Successfully Created",
            products,
        })


    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error while creating a New Product",
        })
    }
};

// We will use this to update our controller

export const updateProductController = async (req, res) => {
    try {

        const { name, slug, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        // Proper Validation

        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" })
            case !description:
                return res.status(500).send({ error: "Description is Required" })
            case !price:
                return res.status(500).send({ error: "Price is Required" })
            case !category:
                return res.status(500).send({ error: "Category is Required" })
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" })
            case photo && photo.size > 1000000:
                return res.status(500).send({ error: "Image is Required and Needs to be less than 1mb" })
        };

        const { pid } = req.params;

        const products = await FoodItem.findByIdAndUpdate(pid, { ...req.fields, slug: slugify(name) }, { new: true });

        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        };

        await products.save();

        res.status(200).send({
            success: true,
            message: "Product is Updated Successfully",
            products,
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error while Updating an existing Product",
        })
    }
};

// We use this controller to see all the products except the photo

export const allProductController = async (req, res) => {
    try {
        const products = await FoodItem.find({}).select("-photo").populate('category').limit(12).sort({ createdAt: -1 });
        res.status(201).send({
            success: true,
            message: " All the Products are shown here",
            totalProducts: products.length,
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error to Get All the Products here",
        })
    }
};

// We will find a single product depending on the slug name provided

export const singleProductController = async (req, res) => {
    try {
        const { slug } = req.params;
        const product = await FoodItem.findOne({ slug: slug }).select("-photo").populate('category')
        res.status(200).send({
            success: true,
            message: "This is the specific product",
            product,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error to get a Specific Product",
        })
    }
};

// This controller helps to call the photos only of the products we have

export const photoProductController = async (req, res) => {
    try {

        const { pid } = req.params;

        const product = await FoodItem.findById(pid).select("photo");

        if (product.photo.data) {
            res.set("Content-type", product.photo.contentType);
            return res.status(200).send(product.photo.data);
        };

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error to show the Images of Products",
        })
    }
};

// We are going to create a Filter Product Controller to filter our Menu and show it on the website

export const filterProductController = async (req, res) => {
    try {
        const { checked, radio } = req.body;

        // Check if checked and radio are undefined, assign empty arrays if so
        const checkedArray = checked || [];
        const radioArray = radio || [];

        let args = {};

        if (checkedArray.length > 0) args.category = checkedArray;
        if (radioArray.length === 2) args.price = { $gte: radioArray[0], $lte: radioArray[1] };

        // Fetch products based on filter criteria
        const products = await FoodItem.find(args);

        if (products.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No products found matching the filter criteria",
            });
        }

        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            error,
            message: "Error filtering products",
        });
    }
};


// We will use this controller to search the products on the basis of keywords

export const searchProductController = async (req, res) => {
    try {
        // Extract the keyword from request parameters and ensure it's a string
        const keyword = String(req.params.keywords);

        const results = await FoodItem.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ],
        }).select("-photo");

        res.json(results);

    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            error,
            message: "Error in Searching a Product",
        });
    }
};

export const similarProductController = async (req, res) => {
    try {

        const { pid, cid } = req.params;

        const products = await FoodItem.find({
            category: cid,
            _id: { $ne: pid }
        }).select("-photo").limit(3).populate("category")

        res.status(200).send({
            success: true,
            products,
        })

    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            error,
            message: "Error in Fetching Similar Product",
        });
    }
};


// We will use the Product and Category controller to show the menu that is selected

export const productCategoryController = async (req, res) => {
    try {

        const category = await FoodCategory.findOne({ slug: req.params.slug });

        const products = await FoodItem.find({ category }).populate("category");

        res.status(200).send({
            success: true,
            category,
            products,
        });

    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            error,
            message: "Error in Fetching a Product by Category",
        })
    }
}

// We will use the Token controller to allow the user to make payment

export const paymentTokenController = async (req, res) => {
    try {

        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err)
            } else {
                res.send(response);
            }
        })

    } catch (error) {
        console.log(error)
    }
}

// We will use the Main Payment controller to allow the user to make payment

export const paymentController = async (req, res) => {
    try {

        const { cart, nonce } = req.body;
        let total = 0

        cart.map((i) => { total = total += i.price });
        let newTransaction = gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true
            }
        },

            function (error, result) {
                if (result) {
                    const order = new FoodOrder({
                        products: cart,
                        payment: result,
                        buyer: req.user,
                    }).save()
                    res.json({ ok: true })
                } else {
                    res.status(500).send(error)
                }
            }
        )

    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            error,
            message: "Error to send Client Tokens",
        })
    }
}

// We will use this to delete our products created

export const deleteProductController = async (req, res) => {
    try {
        const { pid } = req.params;
        await FoodItem.findByIdAndDelete(pid).select("-photo");
        res.status(200).send({
            success: true,
            message: "All Products deleted successfully"
        });
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            error,
            message: "Error in deleting a specific Product",
        })
    }
}