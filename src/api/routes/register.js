
const { register, login } = require("../controllers/register");


const registerRouter = require('express').Router();

registerRouter.get('/login', login);
registerRouter.post('/', register);


module.exports = registerRouter;