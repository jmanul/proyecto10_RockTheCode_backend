
const { register, login, logout, changePassword } = require("../controllers/register");
const { isAuth } = require("../../middlewares/auth/auth");


const registerRouter = require('express').Router();

registerRouter.post('/login', login);
registerRouter.post('/', register);
registerRouter.get('/logout', isAuth, logout);
registerRouter.put('/changePassword', isAuth, changePassword);


module.exports = registerRouter;