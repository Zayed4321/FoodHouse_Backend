import USER from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import orderModel from "../models/orderModel.js";

export const userRegister = async (req, res) => {
  try {
    const { name, email, password, reconfirmPassword, phone, answer, role } = req.body;
    if (!name) {
      res.send({
        message: "Name is required !",
      });
    }
    if (!email) {
      res.send({
        message: "Email is required !",
      });
    }
    if (!password) {
      res.send({
        message: "Password is required !",
      });
    }
    if (!reconfirmPassword) {
      res.send({
        message: "Re-enter password !",
      });
    }
    if (!answer) {
      res.send({
        message: "Answer is required !",
      });
    }

    // When we return a function it will not be further processed and that is why the data will not be saved in mongoDB

    if (password !== reconfirmPassword) {
      return res.send({
        message: "Password do not match with each other",
      });
    }

    // Stop the same user registered already to reregister again

    const existingUser = await USER.findOne({ email: email, name: name });

    // Returning th eexisting user will stop the function whenever there is two user of the same name and email

    if (existingUser) {
      return res.status(200).send({
        // This is an error as the user is already registered so we set the success to false
        success: false,
        message:
          "User with the same name and email already exists, please login",
      });
    }

    // We will hash the password using the function we have made in helpers folder earlier

    const hashedPassword = await hashPassword(password);

    const user = new USER({ name, email, phone, answer, password: hashedPassword });
    user.save();

    res.status(201).send({
      success: true,
      message: " User is successfully registered",
      user,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      success: false,
      message: "Registration Error",
      error,
    });
  }
};

// We will make the forgot Pass page where we take three data from user and verify method so that any problem may be easily averted

export const forgotPassController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body

    if (!email) {
      res.status(400).send({
        message: "Email is required"
      });
    }

    if (!answer) {
      res.status(400).send({
        message: "What's your favourite subject?"
      });
    }

    if (!newPassword) {
      res.status(400).send({
        message: "Give your new password"
      });
    }

    // We have to the actual user with the same name and id

    const user = await USER.findOne({ email, answer })

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email or Username"
      })
    };

    // Now we will hash the new password and update the data

    const hashedNewPass = await hashPassword(newPassword);

    await USER.findByIdAndUpdate(user._id, { password: hashedNewPass });

    res.status(200).send({
      success: true,
      message: "Password changed succesfully"
    });

  } catch (error) {
    console.log(error),
      res.status(500).send({
        success: false,
        message: "Something ain't working here",
        error
      })
  }
}

// Get request to call all the users in our database

export const allUserData = async (req, res) => {
  try {
    const allUsersInfo = await USER.find();
    res.send({
      message: allUsersInfo,
    });
  } catch (error) {
    console.log(error.message);
  }
};

// Post request to detect and allow the user to login if there is an existing ID

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return req.status(404).send({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const userExists = await USER.findOne({ email });

    if (!userExists) {
      return res.status(404).send({
        success: false,
        message: "User not found, please register first"
      })
    };

    // We can use this function to comapre the password given by user with the existing one while hashing it. However we already made a function so it's no longer needed

    const match = await comparePassword(password, userExists.password);

    if (!match) {
      return res.status(200).send({
        success: false,
        message: "User Login Failed",
        correction: "Invalid Password",
      });
    };

    // If we can verify that the user is verified then we can give him a token

    const token = jwt.sign({ id: userExists._id }, process.env.JWT_SECRETS, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login Successful",
      user: {
        name: userExists.name,
        email: userExists.email,
        phone: userExists.phone,
        answer: userExists.answer,
        role: userExists.role
      },
      token,
    });

  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });

  }

};

// Update the Profile Controller 

export const updateController = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body
    const user = await USER.findOne({ email })

    if (password && password.length < 6) {
      return res.json({ error: "Password is required and should be 6 characters long" })
    };

    const hashedPassword = password ? await hashPassword(password) : undefined;

    const updateUser = await USER.findByIdAndUpdate(user._id, {
      name: name || user.name,
      email: email || user.email,
      password: hashedPassword || user.password,
      phone: phone || user.phone
    }, { new: true })

    res.status(200).send({
      success: true,
      message: "Profile is Updated Succesfully",
      updateUser
    });

  } catch (error) {
    console.log(error),
      res.status(500).send({
        success: false,
        message: "Failed to Update Profile",
        error
      })
  }
}


// Handle and Receive the Orders placed by the user 

export const getOrderController = async (req, res) => {
  try {

    const orders = await orderModel.find({ buyer: req.user }).populate("products", "-photo").populate("buyer", "name");

    res.json(orders);

  } catch (error) {
    console.log(error),
      res.status(500).send({
        success: false,
        message: "Failed to Fetch Order Data",
        error
      })
  }
}


// Handle and Receive the Orders placed by the user in the backend and Dashboard side of admin

export const getAllOrderController = async (req, res) => {
  try {
    // Corrected the sort value by changing "-1" to -1
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to Fetch Order Data",
      error
    });
  }
}


// Handle and Receive the Orders Status through this system 

export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to Update Order Status",
      error
    });
  }
};


