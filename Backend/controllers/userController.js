const Users = require("../models/userModel");
const Posts = require("../models/postModel");
const Retweets = require("../models/retweetsModel");
const Comments = require("../models/commentModel");
const ErrorHandler = require("../utils/ErrorHandler");
const cloudinary = require("cloudinary");
const sharp = require("sharp");

//for registration of new users.
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, profile, handle, location, website } = req.body;
        let user = await Users.findOne({ handle, email });
        if (user) {
            return next(new ErrorHandler("User already exists", 400));
        } else {
            const profileResult = await handleImageUpload(profile.image, "ProfileImage");

            const bannerResult = await handleImageUpload(profile.banner, "ProfileBanner");

            const image = { public_id: profileResult.public_id, url: profileResult.secure_url };
            const banner = { public_id: bannerResult.public_id, url: bannerResult.secure_url };

            const userProfile = { image: image, banner: banner };
            user = await Users.create({ handle, name, email, password, profile: userProfile, location, website });

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

async function handleImageUpload(image, folder) {
    if (!image) {
        return null;
    }

    const base64Buffer = Buffer.from(image.substring(22), "base64");
    const originalSizeInBytes = base64Buffer.length;
    const originalSizeInKB = originalSizeInBytes / 1024;

    if (originalSizeInKB > 100) {
        const { format, width } = await sharp(base64Buffer).metadata();

        const compressedBuffer = await sharp(base64Buffer)
            .toFormat(format)
            .resize({ width: Math.floor(width * 0.5) })
            .webp({ quality: 50, chromaSubsampling: "4:4:4" })
            .toBuffer();

        const compressedBase64 = compressedBuffer.toString("base64");

        const result = await cloudinary.v2.uploader.upload(`data:image/jpeg;base64,${compressedBase64}`, {
            folder: folder,
        });

        return result;
    } else {
        const result = await cloudinary.v2.uploader.upload(image, {
            folder: folder,
        });

        return result;
    }
}

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
        const { name, profile, website, location, description } = req.body;

        if (name) {
            user.name = name;
        }
        if (website !== undefined) {
            user.website = website;
        }
        if (description !== undefined) {
            user.description = description;
        }
        if (location !== undefined) {
            user.location = location;
        }

        const imageProcessingPromises = [];
        if (profile && profile.image) {
            const base64Buffer = Buffer.from(profile.image.substring(22), "base64");
            const originalSizeInBytes = base64Buffer.length;
            const originalSizeInKB = originalSizeInBytes / 1024;

            if (originalSizeInKB > 100) {
                imageProcessingPromises.push(processImage(user.profile.image, base64Buffer, "ProfileImage"));
            }
        }

        if (profile && profile.banner) {
            const base64Buffer = Buffer.from(profile.banner.substring(22), "base64");
            const originalSizeInBytes = base64Buffer.length;
            const originalSizeInKB = originalSizeInBytes / 1024;

            if (originalSizeInKB > 100) {
                imageProcessingPromises.push(processImage(user.profile.banner, base64Buffer, "ProfileBanner"));
            }
        }

        if (imageProcessingPromises.length > 0) {
            await Promise.all(imageProcessingPromises);
        }

        await user.save();
        res.status(200).json({
            success: true,
            message: "Updated successfully",
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

async function processImage(imageData, base64Buffer, folder) {
    try {
        // Destroy existing image on Cloudinary
        if (imageData.public_id) {
            await cloudinary.v2.uploader.destroy(imageData.public_id);
        }

        const { format, width } = await sharp(base64Buffer).metadata();
        const compressedBuffer = await sharp(base64Buffer)
            .toFormat(format)
            .resize({ width: Math.floor(width * 0.5) })
            .webp({ quality: 50, chromaSubsampling: "4:4:4" })
            .toBuffer();

        const compressedBase64 = compressedBuffer.toString("base64");

        const myCloud = await cloudinary.v2.uploader.upload(`data:image/jpeg;base64,${compressedBase64}`, {
            folder: folder,
        });

        imageData.public_id = myCloud.public_id;
        imageData.url = myCloud.secure_url;
    } catch (error) {
        next(new ErrorHandler("Error processing image:" + error.message, 500));
    }
}

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

        const userPostsNumber = await Posts.find({ owner: req.user._id });
        const userRetweetsNumber = await Retweets.find({ userRetweeted: req.user._id });
        const userCommentsNumber = await Comments.find({ owner: req.user._id });
        const total = userPostsNumber.length + userRetweetsNumber.length + userCommentsNumber.length;
        res.status(200).json({
            success: true,
            myProfile,
            total,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

//profile of other user
exports.profileOfUsers = async (req, res, next) => {
    try {
        const userProfile = await Users.findById(req.params.id);
        const userPostsNumber = await Posts.find({ owner: req.params.id });
        const userRetweetsNumber = await Retweets.find({ userRetweeted: req.params.id });
        const userCommentsNumber = await Comments.find({ owner: req.params.id });

        const total = userPostsNumber.length + userRetweetsNumber.length + userCommentsNumber.length;

        if (!userProfile) {
            return next(new ErrorHandler("No such user", 404));
        }
        res.status(200).json({
            success: true,
            userProfile,
            total,
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
