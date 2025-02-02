

const { isAuth, idCreated, idAuth, rollAuth } = require("../../middlewares/auth/auth");

const { postTicket, putStatusById, getTicketsByIdEvent, getTicketsByIdPass,  getTicketsByIdUser, getTicketsByIdEventAndUser, getById } = require("../controllers/tickets");


const ticketsRouter = require('express').Router();


ticketsRouter.post('/', isAuth, idCreated, postTicket);
ticketsRouter.put('/event/:eventId/status/:ticketId', isAuth, idCreated, putStatusById);
ticketsRouter.get('/event/:eventId', isAuth, idCreated, getTicketsByIdEvent);
ticketsRouter.get('/event/:eventId/pass/:passId', isAuth, idCreated, getTicketsByIdPass);
ticketsRouter.get('/user/:userId', isAuth, idAuth, getTicketsByIdUser);
ticketsRouter.get('/event/:eventId/user/:userId', isAuth, idCreated, getTicketsByIdEventAndUser);
ticketsRouter.get('/:ticketId', isAuth, getById);


module.exports = ticketsRouter;


