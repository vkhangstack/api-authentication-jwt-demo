"use strict";

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.status(400).send("Access Denied");

    const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(400).send("Invalid token");
  }
};
