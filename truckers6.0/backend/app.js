const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const companyRoutes = require("./routes/company");
const catalogRoutes = require("./routes/catalog");
const userCompanyRelationshipRoutes = require("./routes/user-company-relationship");
const emailRoutes = require("./routes/email");

const app = express();

mongoose
  .connect(
    "mongodb+srv://pholmqu:" +process.env.MONGO_ATLAS_PW + "@cluster0-ssh0k.mongodb.net/node-angular?retryWrites=true&w=majority"
    ,{ useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/", express.static(path.join(__dirname, "angular")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers","*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS, SEND"
  );
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/catalog", catalogRoutes);
app.use("/api/user-company-relationship", userCompanyRelationshipRoutes);
app.use("/api/sendemail", emailRoutes);
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "angular", "index.html"));
});

module.exports = app;
