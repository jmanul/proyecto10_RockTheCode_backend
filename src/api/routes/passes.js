


const { isAuth, idCreated, idAuth } = require("../../middlewares/auth/auth");


const { getPassesByEvent, getPassById, postPass, putPass, deletePass } = require("../controllers/passes");


const passesRouter = require('express').Router();

passesRouter.get('/:passId', isAuth, getPassById);
passesRouter.get('/event/:eventId', isAuth, getPassesByEvent);
passesRouter.post('/event/:eventId', isAuth, idCreated, postPass);
passesRouter.put('/:passId', isAuth, idCreated, putPass);
passesRouter.delete('/:passId', isAuth, idCreated, deletePass);


module.exports = passesRouter;

