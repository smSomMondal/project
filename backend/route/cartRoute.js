import express from 'express';
import {chqProtectedUser,chqSeler} from '../middleware/userMiddleware.js';
import {  addToCart, updateCart, orderCart, cancelCartUser, appOrder, canOrder, cartInfo,cartList } from '../controller/cartControler.js';

const cartApi = express.Router();

cartApi.post('/add',chqProtectedUser, addToCart); 
cartApi.post('/update',chqProtectedUser, updateCart); 
cartApi.post('/info',chqProtectedUser, cartInfo); 
cartApi.post('/list',chqProtectedUser, cartList); 
cartApi.post('/order',chqProtectedUser, orderCart); 
cartApi.post('/cancelUser',chqProtectedUser, cancelCartUser); 
cartApi.post('/approveSeler',chqSeler, appOrder); 
cartApi.post('/cancelSeler',chqSeler, canOrder); 

export default cartApi;