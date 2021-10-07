"use strict";

const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");

/** create user */
router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send("Input please");

    const user = await new User(req.body);
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    user.password = bcrypt.hashSync(user.password, salt);

    await user.save();
    return res.status(200).send(user);
  } catch (error) {
    return res.status(400).send("You have error", error);
  }
});

module.exports = router;
