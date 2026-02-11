


const { isAuth, idCreated } = require("../../middlewares/auth/auth");

const { 
     getPassesByEvent, 
     getPassById, 
     postPass, 
     putPass, 
     deletePass,
     addGuestToPass,
     updateGuestInPass,
     removeGuestFromPass,
     getPassGuestList
} = require("../controllers/passes");

const passesRouter = require('express').Router();

// Rutas básicas de pases
passesRouter.get('/:passId', isAuth, getPassById);
passesRouter.get('/event/:eventId', isAuth, getPassesByEvent);
passesRouter.post('/event/:eventId', isAuth, idCreated, postPass);
passesRouter.put('/event/:eventId/pass/:passId', isAuth, idCreated, putPass);
passesRouter.delete('/event/:eventId/pass/:passId', isAuth, idCreated, deletePass);

// Rutas para gestión de lista de invitados (pases privados)
passesRouter.get('/:passId/guests', isAuth, idCreated, getPassGuestList);
passesRouter.post('/:passId/guests', isAuth, idCreated, addGuestToPass);
passesRouter.put('/:passId/guests/:guestUserId', isAuth, idCreated, updateGuestInPass);
passesRouter.delete('/:passId/guests/:guestUserId', isAuth, idCreated, removeGuestFromPass);

module.exports = passesRouter;

