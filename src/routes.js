const express = require("express");
const routes = express.Router();
const UserController = require('./controllers/UserController');


routes.post("/user/register", UserController.createUser);
routes.get("/user/:userId", UserController.getUserById);

module.exports = routes;
