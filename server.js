const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { app } = require("./app");
const path = require("path");

// read from enviroment variable
dotenv.config(); 
const mongoURL = process.env.MONGO_URL;

// connect to database
const connectToDB = () => {
  mongoose
    .connect(mongoURL)
    .then(() => {
      console.log(`connected to database: ${mongoURL}`);
    })
    .catch((error) => {
      console.error("Error to connect to database");
      console.error(error);
    });
};
connectToDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`the server is running on port: ${PORT}`);
});
