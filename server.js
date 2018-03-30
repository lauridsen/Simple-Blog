process.env.NODE_ENV = process.env.NODE_ENV || "development";

const configureExpress = require("./config/express");
const configureMongoose = require("./config/mongoose");
const configurePassport = require("./config/passport");

const db = configureMongoose();
const app = configureExpress();
const passport = configurePassport();
app.listen(3000);

module.exports = app;

console.log("Server is running at http://localhost:3000/");
