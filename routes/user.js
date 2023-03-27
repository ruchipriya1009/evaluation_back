const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); require("dotenv").config();
const { User } = require("../models/user");
const { Router } = require("express");
const userRouter = Router();
userRouter.post("/register", async (req, res) => {
    try {
        const payload = req.body;
        const user = await User.findOne({ email: payload.email }); if (user) {
            return res.send({ msg: "Please login, user already exist" });
        } else {

            const hashPassword = await bcrypt.hashSync(payload.password, 8); payload.password = hashPassword;
            const newUser = new User(payload); await newUser.save();

            return res.json({ msg: "User registered.", user: newUser });
        }
    } catch (error) {
        res.send({ msg: error.message });
    }
});
userRouter.post("/login", async (req, res) => {
    try {
        const payload = req.body;
        const user = await User.findOne({ email: payload.email });
        if (!user) return res.send("Please signup first");

        const isPasswordCorrect = await bcrypt.compareSync(payload.password,
            user.password

        );
        if (isPasswordCorrect) {

            const token = await jwt.sign({ email: user.email, userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: 20 })
            res.json({ msg: "Login success", token });
        } else {
            res.send({ msg: "Invalid credentials" });
        }

    } catch (error) {
        res.send(error.message);
    }
});
module.exports = { userRouter };