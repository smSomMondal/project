import express from "express"
import {chqProtectedUser} from "../middleware/userMiddleware.js";
import {registerUser, authUser, updateUser, forgotPassword, resetPassword} from "../controller/userController.js";
const userApi = express.Router();


userApi.post('/signup',registerUser);
userApi.put('/login',authUser);
userApi.post('/updateInfo',chqProtectedUser,updateUser);
userApi.post('/forgotPass',forgotPassword);
userApi.post('/resetPass/:id/:token',resetPassword);


export default userApi;