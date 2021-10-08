"use strict";

require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./database/db");
const createUser = require("./routes/user");
const authLogin = require("./routes/auth");
const RateLimit = require("express-rate-limit");

const limiter = new RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute only 10 request
  max: 10,
});
connectDB();
app.use(limiter);
app.disable("x-powered-by");
app.use(express.json());
app.use("/api/user", createUser);
app.use("/api/auth", authLogin);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
