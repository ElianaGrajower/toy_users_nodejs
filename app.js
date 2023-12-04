const express = require("express");
const toyRoutes = require("./routes/toy.routes");
const userRoutes = require("./routes/user.routes");
const globalErrorHandler = require("./utils/errorHandler");
const AppError = require("./utils/AppError.js");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/toys", toyRoutes);
app.use("/api/v1/users", userRoutes);


app.all("*", (req, res, next) => {
  next(new AppError(404, "The requested resource does not exist on this server"));
});
/* Global error handler */
app.use(globalErrorHandler);

app.all("*", ()=>{});

module.exports.app = app;
