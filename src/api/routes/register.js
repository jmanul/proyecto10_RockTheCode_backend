
const { register, login, logout, changePassword } = require("../controllers/register");
const { isAuth } = require("../../middlewares/auth/auth");


const registerRouter = require('express').Router();

registerRouter.get('/login', login);
registerRouter.post('/', register);
registerRouter.post('/', isAuth, logout);
registerRouter.post('/', isAuth, changePassword);


module.exports = registerRouter;