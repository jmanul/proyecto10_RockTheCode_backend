
const { isAuth } = require("../../middlewares/auth/isAuth");
const { idCreated } = require("../../middlewares/auth/idCreated");

const upload = require('../../middlewares/file/file');
const { getEvents,getEventById,getEventByName,
postEvent,putEvent,deleteEvent } = require("../controllers/events");


const eventsRouter = require('express').Router();

eventsRouter.get('/:id', isAuth, getEventById);
eventsRouter.get('/name/:name', isAuth, getEventByName );
eventsRouter.get('/', isAuth, getEvents);
eventsRouter.post('/', isAuth, upload.single('image'), postEvent);
eventsRouter.put('/:id', isAuth, idCreated, upload.single('image'), putEvent);
eventsRouter.delete('/:id', isAuth, idCreated, deleteEvent);


module.exports = eventsRouter;