const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/generateToken');

module.exports.registerUser = async (req, res) => {
    try {
        let { email, fullname, password } = req.body;

        let user = await userModel.findOne({ email: email });
        if (user) {
            req.flash("error", "You already have an account, please Login!");
            return res.redirect("/");
        }

        const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash(password, salt);

        let newUser = await userModel.create({
            fullname,
            email,
            password: hash,
        });

        let token = generateToken(newUser);
        res.cookie('token', token);
        return res.redirect("/shop");  // Redirect after successful registration
    } catch (err) {
        console.log(err.message);
        req.flash("error", "Internal server error");
        return res.redirect("/");
    }
};

module.exports.loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;

        let user = await userModel.findOne({ email: email });
        if (!user) {
            req.flash("error", "Email or password is wrong");
            return res.redirect("/");
        }

        const match = await bcrypt.compare(password, user.password);
        if (match) {
            let token = generateToken(user);
            res.cookie("token", token);
            return res.redirect("/shop");
        } else {
            req.flash("error", "Email or password is wrong");
            return res.redirect("/");
        }
    } catch (err) {
        console.error("Login error:", err);
        req.flash("error", "Internal server error");
        return res.redirect("/");
    }
};

module.exports.logout = function (req, res){
    res.cookie("token", "")
    res.redirect("/")
}