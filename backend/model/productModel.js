import mongoose from "mongoose";

/*const cart = new mongoose.Schema({
    Id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    step: {
        type: String,
        enum: ["add", "order", "buy"],
        default: "add",
    },
});*/

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    pId: {
        type: String,
        required: true,
        unique: true,
    },
    category: {
        type: String,
        enum: [
            "Fashion",
            "Footwear",
            "Electronics",
            "Home & Kitchen",
            "Beauty & Personal Care",
            "Sports & Fitness",
            "Baby Products",
            "Grocery & Essentials",
            "Gaming & Entertainment",
            "Books & Stationery",
            "Automotive"
        ],
        required: true
    },
    subcategory: {
        type: String,
        enum: [
            "Men Clothing", "Women Clothing", "Kids Clothing",
            "Men Footwear", "Women Footwear", "Kids Footwear",
            "Mobiles & Tablets", "Laptops & Computers", "TV & Home Entertainment",
            "Kitchen Appliances", "Home Decor", "Furniture",
            "Makeup", "Skincare", "Haircare",
            "Fitness Equipment", "Sportswear",
            "Diapers", "Baby Toys",
            "Snacks", "Staples",
            "Video Games", "Gaming Accessories",
            "Fiction", "Stationery",
            "Car Accessories", "Bike Accessories"
        ]
    },
    brand: {
        type: String
    },
    stock: {
        type: String,
        required: true,
        default: 0,
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming your Seller is a User model
        required: true
    },
    imagesUrl: {
        type: String,
    },
    orderList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cart",
        }
    ],

}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;
/*
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
         type: String,
        required: true
     },
    description: {
         type: String,
          required: true
        },
    price: {
         type: Number,
          required: true
         },
    category: {
         type: String,
          required: true
         },
    quantity: {
         type: Number,
          required: true
         },
    image: { 
        type: String,
         required: true
         }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
*/
