

const { isAuth, idCreated, idAuth } = require("../../middlewares/auth/auth");

const { postTicket, getTicketsByIdEvent, getTicketsByIdUser, getTicketsByIdEventAndUser } = require("../controllers/tickets");


const ticketsRouter = require('express').Router();


ticketsRouter.post('/', isAuth, idCreated, postTicket);
ticketsRouter.get('/event/:eventId', isAuth, idCreated, getTicketsByIdEvent);
ticketsRouter.get('/user/:userId', isAuth, idAuth, getTicketsByIdUser);
ticketsRouter.get('/event/:eventId/user/:userId', isAuth, idCreated, getTicketsByIdEventAndUser);


module.exports = ticketsRouter;