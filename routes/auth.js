"use strict";
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const Joi = require("joi");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send("You have an error input");

    const user = await User.find({ email: { $eq: req.body.email.toString() } });
    if (!user) return res.status(400).send("Invalid email or password.");
    let password = user[0].password;
    const validPassword = await bcrypt.compare(req.body.password, password);

    if (!validPassword) {
      return res.status(400).send("Invalid password or email.");
    }
    const token = user[0].generateAuthToken();
    res.send(token);
  } catch (error) {
    return res.status(404).send("Bad request");
  }
});
const validate = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(user);
};

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password-__v");
    return res.send(user);
  } catch (error) {
    return res.status(400).send("Bad request");
  }
});
module.exports = router;
