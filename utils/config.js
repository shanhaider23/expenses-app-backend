const env = String(process.env.NODE_ENV);
if (env !== "production") {
  require("dotenv").config();
}

let PORT = process.env.PORT || 5000;
let MONGODB_URI = process.env.MONGODB_URI;
let SECRET = process.env.SECRET;

module.exports = {
  PORT,
  MONGODB_URI,
  SECRET,
};
