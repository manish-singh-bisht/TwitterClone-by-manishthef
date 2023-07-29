const Users = require("../models/userModel");
const Posts = require("../models/postModel");
const Comments = require("../models/commentModel");
const ErrorHandler = require("../utils/ErrorHandler");

//for registration of new users.
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, profile, handle } = req.body;
        let user = await Users.findOne({ handle, email });
        if (user) {
            return next(new ErrorHandler("User already exists", 400));
        } else {
            user = await Users.create({ handle, name, email, password, profile });

            const token = await user.generateToken();

            return res
                .status(201)
                .cookie("token", token, { expires: new Date(Date.now() + process.env.EXPIRE * 24 * 60 * 60 * 1000), httpOnly: true })
                .json({
                    success: true,
                    user,
                });
        }
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

//for login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorHandler("Incorrect email or password", 400));
        }

        //matching passwords
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return next(new ErrorHandler("Incorrect email or password", 400));
        }

        //tokenGeneration
        const token = await user.generateToken();

        res.status(200)
            .cookie("token", token, { expires: new Date(Date.now() + process.env.EXPIRE * 24 * 60 * 60 * 1000), httpOnly: true })
            .json({
                success: true,
                user,
            });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

//logout for users
exports.logout = async (req, res, next) => {
    try {
        res.status(200)
            .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
            .json({
                success: true,
                message: "logged out successfully",
            });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

//follow others
exports.followingOrFollow = async (req, res, next) => {
    try {
        const userToFollow = await Users.findById(req.params.id);
        const currentUser = await Users.findById(req.user._id);

        if (!userToFollow) {
            return next(new ErrorHandler("no such user found", 404));
        }

        if (userToFollow._id.toString() === currentUser._id.toString()) {
            return next(new ErrorHandler("cannot follow self"), 400);
        }

        //for unfollow
        if (currentUser.following.includes(userToFollow._id)) {
            const indexOfFollowerInUserToFollow = userToFollow.followers.indexOf(currentUser._id);
            const indexOfFollowingInCurrentUser = currentUser.following.indexOf(userToFollow._id);

            userToFollow.followers.splice(indexOfFollowerInUserToFollow, 1);
            currentUser.following.splice(indexOfFollowingInCurrentUser, 1);

            await userToFollow.save();
            await currentUser.save();

            return res.status(200).json({
                success: true,
                message: "successfully unfollowed",
            });
        } else {
            //for follow
            currentUser.following.push(userToFollow._id);
            userToFollow.followers.push(currentUser._id);

            await userToFollow.save();
            await currentUser.save();

            return res.status(200).json({
                success: true,
                message: "successfully followed",
            });
        }
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

//Update Profile of user
exports.updateProfile = async (req, res, next) => {
    try {
        const user = await Users.findById(req.user._id);
        const { email, name } = req.body;

        if (name) {
            user.name = name;
        }
        if (email) {
            user.email = email;
        }

        await user.save();
        res.status(200).json({
            success: true,
            message: " updated successfullt",
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

//update  password of user
exports.updatePassword = async (req, res, next) => {
    try {
        const user = await Users.findById(req.user._id).select("+password");
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return next(new ErrorHandler("Enter old/new password", 400));
        }
        const isMatch = await user.matchPassword(oldPassword);
        if (!isMatch) {
            return next(new ErrorHandler("Enter correct Old Password", 400));
        }

        user.password = newPassword;
        await user.save();
        res.status(200).json({
            success: true,
            message: "password updated successfullt",
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

//gets the logged in user's profile
exports.myProfile = async (req, res, next) => {
    try {
        const myProfile = await Users.findById(req.user._id).populate("posts");
        res.status(200).json({
            success: true,
            myProfile,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

//profile of other user
exports.profileOfUsers = async (req, res, next) => {
    try {
        const userProfile = await Users.findById(req.params.id).populate("posts");

        if (!userProfile) {
            return next(new ErrorHandler("No such user", 404));
        }
        res.status(200).json({
            success: true,
            userProfile,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};
//search profile/user
exports.searchUser = async (req, res, next) => {
    try {
        if (req.params.handle.length === 0) {
            res.status(200).json({
                success: true,
                users: [],
            });
        }
        if (req.params.handle.length > 0) {
            const users = await Users.find({ $or: [{ name: { $regex: req.params.handle, $options: "i" } }, { handle: { $regex: req.params.handle, $options: "i" } }] }).limit(10);

            if (users.length === 0) {
                return res.status(200).json({
                    success: true,
                    message: "No Such User",
                });
            }
            return res.status(200).json({
                success: true,
                users,
            });
        }
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

//gets all users in database
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await Users.find().select("handle name _id description profile");
        res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};
