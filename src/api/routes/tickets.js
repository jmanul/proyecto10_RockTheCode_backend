

const { idAuth } = require("../../middlewares/auth/idAuth");
const { isAuth
} = require("../../middlewares/auth/isAuth");
const { rollAuth } = require("../../middlewares/auth/rollAuth");

const { postTicket } = require("../controllers/tickets");


const ticketsRouter = require('express').Router();


ticketsRouter.post('/', isAuth, idAuth, postTicket);


module.exports = ticketsRouter;