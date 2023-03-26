const Users = require("../models/userModel");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler");

//Authentication of token received while login
exports.isAuthenticated = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return next(new ErrorHandler("Please login first"), 401);
        }
        const authentication = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = await Users.findById(authentication._id);
        next();
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};
