const express = require('express');
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model");
let userModel = require("../models/user-model")

router.get('/', (req, res) => {
    let error = req.flash("error");
    res.render("index", {error, loggedin: false});
});



router.get("/shop", isLoggedIn, async (req, res) => {
    try {
        const products = await productModel.find();
        let success = req.flash("success")
        res.render("shop", { products, success });  // ✅ Only this one is needed
    } catch (err) {
        console.error("Error fetching products:", err);
        req.flash("error", "Unable to load products");
        res.redirect("/");
    }
});

router.get("/account", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({email: req.user.email});
    console.log(user);
    
    res.render("account", {user})
});

router.get('/cart', isLoggedIn, async (req, res) => {
    try {
      const user = await userModel.findOne({ email: req.user.email }).populate('cart');
  
      // Calculate bill per item: price + 20 (platform fee) - discount
      const bills = user.cart.map(item => Number(item.price) + 20 - Number(item.discount));
  
      // Optionally total bill for all cart items
      const totalBill = bills.reduce((sum, val) => sum + val, 0);
  
      res.render("cart", { user, bills, totalBill });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  });
  
 

router.get('/addtocart/:productid', isLoggedIn, async (req, res) => {
   let user = await userModel.findOne({email: req.user.email})
   
   user.cart.push(req.params.productid)
   await user.save()
   req.flash("success" , "Added to Cart")
   res.redirect("/shop")
});


module.exports = router;
