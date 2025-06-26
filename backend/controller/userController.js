import expressAsyncHandler from "express-async-handler";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
import dotenv from 'dotenv';

dotenv.config();

//by som
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
}

//by som
const registerUser = expressAsyncHandler(async (req, res) => {

    try {
        console.log(req.body);
        
        const { name, email, password, contact, userType } = req.body;
        if (!name || !email || !contact || !userType || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        const existingUser = await User.findOne({ email });        
        if (existingUser) {
            console.log(existingUser);
            return res.status(400).json({ message: "User already exists" });
            
        }
        const user = await User.create({ name, email, password, contact, userType });
        if (user) {
            res.status(200).json({
                message: "success"
            })
        }
        else {
            res.status(400).json({ message: "invalid user data" });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Server error" });

    }

});

//by som
const authUser = expressAsyncHandler(async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && (await user.comparePassword(password))) {
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                contact: user.contact,
                userType: user.userType,
                address: user.address,
                token: generateToken(user._id),
            });
        }
        else {
            res.status(400).json({ message: "Password not match" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });

    }

});

//by som
const updateUser = expressAsyncHandler(async (req, res) => {
    try {
        if (req.user._id) {
            const { name, email, address, newPassword, oldPassword ,contact } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            // if (oldPassword && !(await user.comparePassword(oldPassword))) {
            //     return res.status(400).json({ message: "Old password is incorrect" });
            // }
            user.name = name || user.name;
            user.email = email || user.email;
            user.contact = contact || user.contact;
            user.address = address || user.address;
            if (newPassword) {
                user.password = newPassword;
            }

            await user.save();

            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                contact: user.contact,
                userType: user.userType,
                address: user.address,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: "Unauthorized" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

//by som
const forgotPassword = expressAsyncHandler(async (req, res) => {

    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email });
        if (!user)
            return res.status(400).json("User not found!");
        const data = {
            user: {
                email: user.email
            }
        };
        const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "5m" });
        const link = `${process.env.FRONTEND}/resetPassword/${user._id}/${token}`
        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Password Reset',
            text: `Please use the following link to reset your password: ${link}`
        };
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: "Failed to send email", error });
            } else {
                return res.status(200).json({ message: 'Token sent to email!' });
            }
        });
    }
    catch (err) {
        res.status(500).json(err.message);
    }
});

//by som
const resetPassword = expressAsyncHandler(async (req, res) => {


    try {
        const { password } = req.body;
        const { id, token } = req.params;
        const user = await User.findById(id);
        if (!user) return res.status(404).json("User not found!");

        const verify = jwt.verify(token, process.env.JWT_SECRET);
        if (!verify) return res.status(401).json("Invalid token");

        if (verify.user.email !== user.email)
            return res.status(400).json("Invalid user");

        user.password = password;
        await user.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            res.status(401).json({ message: "Token has expired" });
        } else if (err.name === 'JsonWebTokenError') {
            res.status(401).json({ message: "Invalid token" });
        } else {
            console.error(err);
            res.status(500).json({ message: "Internal server error", error: err.message });
        }
    }
});


/*const uploadImg = expressAsyncHandler(async(req,res)=>{
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const imgRef = ref(storage, `files/user/${req.user.email}`);
        const snapshot = await uploadBytes(imgRef, req.file.buffer, { contentType: req.file.mimetype });
        const downloadURL = await getDownloadURL(snapshot.ref);
        res.status(200).json({ imageUrl: downloadURL });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: error.message });
    }
})*/
export { registerUser, authUser, updateUser, forgotPassword, resetPassword }