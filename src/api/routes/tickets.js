

const { isAuth, idAuth } = require("../../middlewares/auth/auth");

const { postTicket, getTicketsByIdEvent } = require("../controllers/tickets");


const ticketsRouter = require('express').Router();


ticketsRouter.post('/', isAuth, idAuth, postTicket);
ticketsRouter.get('/event/:eventId', isAuth, idAuth, getTicketsByIdEvent);


module.exports = ticketsRouter;