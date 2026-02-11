
const { isAuth, idCreated } = require("../../middlewares/auth/auth");

const upload = require('../../middlewares/file/file');
const { 
     getEvents, 
     getEventById, 
     getEventByStatus, 
     getEventByType, 
     postEvent, 
     putEvent, 
     deleteEvent, 
     getEventByUser,
     createInvitation,
     useInvitation,
     getInvitations
} = require("../controllers/events");


const eventsRouter = require('express').Router();
eventsRouter.get('/userEventsCreate',isAuth, getEventByUser);
eventsRouter.get('/:eventId', isAuth, getEventById);
eventsRouter.get('/status/:eventStatus', isAuth, getEventByStatus);
eventsRouter.get('/type/:slug', isAuth, getEventByType);

eventsRouter.get('/', isAuth, getEvents);
eventsRouter.post('/', isAuth, upload.single('image'), postEvent);
eventsRouter.put('/:eventId', isAuth, idCreated, upload.single('image'), putEvent);
eventsRouter.delete('/:eventId', isAuth, idCreated, deleteEvent);

// Rutas de invitaciones para eventos privados
eventsRouter.post('/:eventId/invitations', isAuth, createInvitation);
eventsRouter.post('/:eventId/invitations/use', isAuth, useInvitation);
eventsRouter.get('/:eventId/invitations', isAuth, getInvitations);


module.exports = eventsRouter;