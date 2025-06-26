import Cart from '../model/cartModel.js';
import Product from '../model/productModel.js';
import User from '../model/userModel.js';
import expressAsyncHandler from 'express-async-handler';

//by som
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const { _id } = req.user;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cartE = await Cart.find({
      $and: [
        { user: _id },
        { product: productId }
      ]
    });

    let createdCart = cartE.find(c => c.stage === 'CREATED');

    if (createdCart) {
      console.log(createdCart);
      return res.status(201).json({ message: "Cart already exists", cart: createdCart });
    }
    

    const cart = new Cart({
      user: _id,
      product: productId,
      items: {
        quantity,
        priceAtTime: product.price
      },
      stage: 'CREATED',
    });

    await cart.save();
    if (!cart) {
      return res.status(500).json({ message: 'Failed to save cart' });
    }

    let user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.cartList.push(cart._id);
    await user.save();
    if (!user) {
      return res.status(500).json({ message: 'Failed to save user cart' });
    }

    res.status(200).json({ message: 'Cart saved successfully', cart });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' + err.message });
  }
};

//by som
const updateCart = async (req, res) => {
  try {

    const { cartId, quantity } = req.body;

    const cart = await Cart.findOneAndUpdate(
      { _id: cartId },
      { $set: { 'items.quantity': quantity } },
      { new: true, runValidators: true }
    );

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    res.status(200).json({ message: 'Cart updated', cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed' });
  }
};
//ordercart

const orderCart = expressAsyncHandler(async (req, res) => {
  try {
    const { orderItem } = req.body;
    const cart = await Cart.findById(orderItem);

    if (!cart) {
      return res.status(404).json({ message: 'cart not found' });
    }
    if (cart.user.toString() !== req.user._id.toString()) {
      //console.log(cart.user ,req.user._id);

      return res.status(403).json({ message: 'You are not authorized to order this cart' });
    }

    let product = await Product.findById(cart.product);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.orderList.push(cart._id);
    await product.save();
    if (!product) {
      return res.status(500).json({ message: 'Failed to save product order' });
    }
    cart.items.priceAtTime = product.price;
    cart.stage = 'ORDERED';//update the cart after order
    await cart.save();

    res.status(200).json({
      message: 'Ordered placed succesfully',
      cart,

    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'server error' + err.message
    });

  }
});


const cancelCartUser = expressAsyncHandler(async (req, res) => {
  try {
    const { orderItem } = req.body;
    const cart = await Cart.findById(orderItem);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    if (cart.user !== req.user._id) {
      return res.status(403).json({ message: 'You are not authorized to cancel this cart' });
    }
    if (cart.stage !== 'ORDERED') {
      return res.status(400).json({ message: 'Only ordered carts can be cancelled by user' });
    }
    // Remove cart from product's orderList
    let product = await Product.findById(cart.product);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    product.orderList = product.orderList.filter((item) => item.toString() !== cart._id.toString());
    await product.save();
    cart.stage = 'CANCELLED';
    await cart.save();
    res.status(200).json({
      message: 'cart cancel succesfully',
      cart,
    });

  } catch (err) {
    res.status(500).json({ message: 'server error' + err.message });
  }

});


const appOrder = expressAsyncHandler(async (req, res) => {
  try {
    const { cartId } = req.body;
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: 'cart not found' });
    }
    const product = await Product.findById(cart.product);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to approve this cart' });
    }
    if (cart.stage !== 'ORDERED') {
      return res.status(400).json({ message: 'Only ordered carts can be approved by seller' });
    }
    if (cart.items.quantity > product.stock) {
      return res.status(400).json({ message: 'Quantity is not available' });
    }
    product.stock = product.stock - cart.items.quantity;
    product.orderList = product.orderList.filter((item) => item.toString() !== cart._id.toString());
    await product.save();
    if (!product) {
      return res.status(500).json({ message: 'Failed to save product quantity' });
    }
    cart.stage = 'APPROVED';
    await cart.save();
    res.status(200).json({ message: 'Ordered approve by seller', cart });

  } catch (err) {
    res.status(500).json({ message: 'error' + err.message });
  }

});

const canOrder = expressAsyncHandler(async (req, res) => {
  try {
    const { cartId } = req.body;

    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    if (cart.stage !== 'ORDERED') {
      return res.status(400).json({ message: 'Only ordered carts can be cancelled by seller' });
    }

    let product = await Product.findById(cart.product);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to cancel this cart' });
    }
    product.orderList = product.orderList.filter((item) => item.toString() !== cart._id.toString());
    await product.save();
    if (!product) {
      return res.status(500).json({ message: 'Failed to save product quantity' });
    }
    cart.stage = 'CANCELLED';
    await cart.save();
    res.status(200).json({ message: 'Order cancelled by seller', cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }

});

const cartInfo = expressAsyncHandler(async (req, res) => {

  try {
    const { cartId } = req.body;
    const cart = await Cart.findById(cartId).populate('product')
    if (cart) {
      return res.status(200).json({ message: 'cart found', cart })
    }
    return res.status(500).json({ message: 'cart not found' })
  } catch (error) {
    return res.status(500).json({ message: 'error in controler' })
  }
})
const cartList = expressAsyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    const cart = await Cart.find({ user: _id }).populate('product')
    if (cart) {
      return res.status(200).json({ message: 'cart found', cart })
    }
    return res.status(500).json({ message: 'cart not found' })
  } catch (error) {
    return res.status(500).json({ message: 'error in controler' })
  }
})

export { addToCart, updateCart, orderCart, cancelCartUser, appOrder, canOrder, cartInfo, cartList };