

const {isAuth, rollAuth, idAuth } = require("../../middlewares/auth/auth");

const upload = require('../../middlewares/file/file');
const { getUsers, getUserById, postUser, putRollUser,  putUser, addPassFromUser, removePassFromUser, deleteUser } = require("../controllers/users");


const usersRouter = require('express').Router();

usersRouter.get('/userId', isAuth, idAuth, getUserById);
usersRouter.get('/', isAuth, rollAuth('administrator'), getUsers);
usersRouter.post('/', isAuth, rollAuth('administrator'), upload.single('avatar'), postUser);
usersRouter.put('/roll/:userId', isAuth, rollAuth('administrator'), putRollUser);
usersRouter.put('/', isAuth, upload.single('avatar'), putUser);
usersRouter.put('/pass/:passId', isAuth, addPassFromUser);
usersRouter.delete('/pass/:passId', isAuth, removePassFromUser,);
usersRouter.delete('/', isAuth, deleteUser);


module.exports = usersRouter;