

const { idAuth } = require("../../middlewares/auth/idAuth");
const { isAuth
 } = require("../../middlewares/auth/isAuth");
const { rollAuth } = require("../../middlewares/auth/rollAuth");

const upload = require('../../middlewares/file/file');
const { getUsers, getUserById, postUser, putRollUser, putPasswordById, putUser, addEventsFromUser, removeEventFromUser, deleteUser } = require("../controllers/users");


const usersRouter = require('express').Router();

usersRouter.get('/:id', isAuth, idAuth, getUserById);
usersRouter.get('/', isAuth, rollAuth('administrator'), getUsers);
usersRouter.post('/', isAuth, rollAuth('administrator'), upload.single('avatar'), postUser);
usersRouter.put('/roll/:id', isAuth, rollAuth('administrator'), putRollUser);
usersRouter.put('/password/:id', isAuth, idAuth, putPasswordById);
usersRouter.put('/:id', isAuth, idAuth, upload.single('avatar'), putUser);
usersRouter.put('/:id/events/:idEvent', isAuth, idAuth, addEventsFromUser);
usersRouter.delete('/:id/events/:idEvent', isAuth, idAuth, removeEventFromUser,);
usersRouter.delete('/:id', isAuth, idAuth, deleteUser);


module.exports = usersRouter;