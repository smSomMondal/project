import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
import expressAsyncHandler from "express-async-handler";

const chqProtectedUser = expressAsyncHandler(async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            try {
                //req.headers.authorization="Bearer" "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2OTE2ZDYzM2YzZDI1MjcyNzAxODk0YyIsImlhdCI6MTcyMDgwNjg3NCwiZXhwIjoxNzIzMzk4ODc0fQ.EnYqKS5FK3F6Pb81P5kyGHWdCeKJSxP_9TiimzORt7Q"
                token = req.headers.authorization.split(" ")[1];
                //console.log(token);
                
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = await User.findById(decoded.id).select("-password");
                next();
            }
            catch (err) {
                res.status(401);
                throw new Error("Not authorized, token failed");
            }
        }
        if (!token) {
            res.status(401);
            throw new Error("Not authorized, no token");
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });

    }

});

const chqSeler = expressAsyncHandler(async (req, res, next) => {
    try {
        let token;
        // console.log(req.headers.authorization);
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            try {
                //req.headers.authorization="Bearer" "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2OTE2ZDYzM2YzZDI1MjcyNzAxODk0YyIsImlhdCI6MTcyMDgwNjg3NCwiZXhwIjoxNzIzMzk4ODc0fQ.EnYqKS5FK3F6Pb81P5kyGHWdCeKJSxP_9TiimzORt7Q"
                token = req.headers.authorization.split(" ")[1];
                // console.log(req.headers.authorization);                
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                //console.log(decoded);
                let user = await User.findById(decoded.id).select("-password");
                //console.log(user);
                // Check if the user is a seller
                if (user && user.userType === "seller") {
                    req.user = user;
                } else {
                    res.status(401);
                    throw new Error("Not authorized as a seller");
                }
                next();
            }
            catch (err) {
                res.status(401);
                throw new Error("Not authorized, token failed");
            }
        }
        if (!token) {
            res.status(401);
            throw new Error("Not authorized, no token");
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });

    }

});
export { chqProtectedUser,chqSeler };