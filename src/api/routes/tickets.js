

const { isAuth, idCreated, idAuth, rollAuth } = require("../../middlewares/auth/auth");

const { postTicket, putStatusById, getTicketsByIdEvent, getTicketsByIdUser, getTicketsByIdEventAndUser } = require("../controllers/tickets");


const ticketsRouter = require('express').Router();


ticketsRouter.post('/', isAuth, idCreated, postTicket);
ticketsRouter.put('/status/:ticketId', isAuth, rollAuth('administrator'), putStatusById);
ticketsRouter.get('/event/:eventId', isAuth, idCreated, getTicketsByIdEvent);
ticketsRouter.get('/user/:userId', isAuth, idAuth, getTicketsByIdUser);
ticketsRouter.get('/event/:eventId/user/:userId', isAuth, idCreated, getTicketsByIdEventAndUser);


module.exports = ticketsRouter;


