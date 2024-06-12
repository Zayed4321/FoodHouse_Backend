import jwt from "jsonwebtoken";
import USER from "../models/userModel.js";

// This is a general variable for both the functions and it will keep on changing so we are using let

// let decodedValue;

export const requireSignIn = async (req, res, next) => {
  // Here we will at first collect the token from the headers area in postman

  try {
    const tokenCollect = req.headers.authorization;

    if (tokenCollect) {
      // Here we will check whether the user has given the correct token or not.

      const decode = jwt.verify(tokenCollect, process.env.JWT_SECRETS);

      console.log(decode);

      //   decodedValue = decode.id;

      req.user = decode.id;

      return next();
    } else {
      return res.send({
        message: "Token is invalid or missing",
      });
    }
  } catch (error) {
    res.send({
      message: error.message,
    });
  }
};

export const adminCheck = async (req, res, next) => {
  try {
    // console.log(decodedValue);

    const individualUser = await USER.findById(req.user);

    // Now we will check whether the user is an admin or not

    if (individualUser.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "Sorry you cannot go further as you are not an admin. Thanks",
      });
    } else {
      return next();
    }
  } catch (error) {
    res.send({
      message: error.message,
    });
  }
};
