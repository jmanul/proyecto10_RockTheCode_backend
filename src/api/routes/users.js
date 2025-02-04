

const {isAuth, rollAuth, idAuth } = require("../../middlewares/auth/auth");

const upload = require('../../middlewares/file/file');
const { getUsers, getUserById, postUser, putRollUser,  putUser, addPassFromUser, removePassFromUser, deleteUser } = require("../controllers/users");


const usersRouter = require('express').Router();

usersRouter.get('/:userId', isAuth, idAuth, getUserById);
usersRouter.get('/', isAuth, rollAuth('administrator'), getUsers);
usersRouter.post('/', isAuth, rollAuth('administrator'), upload.single('avatar'), postUser);
usersRouter.put('/roll/:userId', isAuth, rollAuth('administrator'), putRollUser);
usersRouter.put('/:userId', isAuth, idAuth, upload.single('avatar'), putUser);
usersRouter.put('/:userId/pass/:passId', isAuth, idAuth, addPassFromUser);
usersRouter.delete('/:userId/pass/:passId', isAuth, idAuth, removePassFromUser,);
usersRouter.delete('/:userId', isAuth, idAuth, deleteUser);


module.exports = usersRouter;