
const { isAuth, idCreated } = require("../../middlewares/auth/auth");

const upload = require('../../middlewares/file/file');
const { getEvents, getEventById, getEventByStatus, getEventByType, postEvent, putEvent, deleteEvent, getEventByUser } = require("../controllers/events");


const eventsRouter = require('express').Router();
eventsRouter.get('/userEvents',isAuth, getEventByUser);
eventsRouter.get('/:eventId', isAuth, getEventById);
eventsRouter.get('/status/:eventStatus', isAuth, getEventByStatus);
eventsRouter.get('/type/:slug', isAuth, getEventByType);

eventsRouter.get('/', isAuth, getEvents);
eventsRouter.post('/', isAuth, upload.single('image'), postEvent);
eventsRouter.put('/:eventId', isAuth, idCreated, upload.single('image'), putEvent);
eventsRouter.delete('/:eventId', isAuth, idCreated, deleteEvent);


module.exports = eventsRouter;