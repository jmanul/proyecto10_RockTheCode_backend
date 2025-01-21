

const {isAuth, rollAuth, idAuth } = require("../../middlewares/auth/auth");

const upload = require('../../middlewares/file/file');
const { getUsers, getUserById, postUser, putRollUser, putPasswordById, putUser, addEventsFromUser, removeEventFromUser, deleteUser } = require("../controllers/users");


const usersRouter = require('express').Router();

usersRouter.get('/:userId', isAuth, idAuth, getUserById);
usersRouter.get('/', isAuth, rollAuth('administrator'), getUsers);
usersRouter.post('/', isAuth, rollAuth('administrator'), upload.single('avatar'), postUser);
usersRouter.put('/roll/:userId', isAuth, rollAuth('administrator'), putRollUser);
usersRouter.put('/password/:userId', isAuth, idAuth, putPasswordById);
usersRouter.put('/:userId', isAuth, idAuth, upload.single('avatar'), putUser);
usersRouter.put('/:userId/events/:eventId', isAuth, idAuth, addEventsFromUser);
usersRouter.delete('/:userId/events/:eventId', isAuth, idAuth, removeEventFromUser,);
usersRouter.delete('/:userId', isAuth, idAuth, deleteUser);


module.exports = usersRouter;