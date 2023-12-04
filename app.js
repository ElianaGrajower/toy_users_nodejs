const express = require("express");
// const cors = require("cors");
const toyRoutes = require("./routes/toy.routes");
const userRoutes = require("./routes/user.routes");
const globalErrorHandler = require("./utils/errorHandler");
const AppError = require("./utils/AppError.js");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
// { origin: ['http://127.0.0.1:5500/', 'http://127.0.0.1:5501/'] }
// app.use(cors());

app.use("/api/v1/toys", toyRoutes);
app.use("/api/v1/users", userRoutes);


app.all("*", (req, res, next) => {
  next(new AppError(404, "The requested resource does not exist on this server"));
});
/* Global error handler */
app.use(globalErrorHandler);

app.all("*", ()=>{});

module.exports.app = app;
