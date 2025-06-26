import mongoose from 'mongoose';
import Product from './productModel.js';

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: {
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    priceAtTime: {
      type: Number,
      required: true
    }
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0
  },
  stage: {
  type: String,
  enum: ['CREATED', 'PENDING', 'ORDERED', 'APPROVED' , 'CANCELLED'],
  default: 'CREATED',
  required: true
}
}, { timestamps: true });


async function calculateTotalPrice(cart) {
  const product = await Product.findById(cart.product);
  if (product) {
    cart.items.priceAtTime = product.price;
    cart.totalPrice = cart.items.quantity * product.price;
  }
}

cartSchema.pre('save', async function (next) {
  await calculateTotalPrice(this);
  next();
});

cartSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  const cart = await this.model.findOne(this.getQuery());
  if (!cart) return next();

  
  if (update.items) {
    cart.items = update.items;
  }
  if (update.product) {
    cart.product = update.product;
  }

  await calculateTotalPrice(cart);
  update.totalPrice = cart.totalPrice;
  update['items.priceAtTime'] = cart.items.priceAtTime;

  next();
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
