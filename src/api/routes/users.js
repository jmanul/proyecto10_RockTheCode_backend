

// const { idAuth } = require("../../middleware/idAuth");
// const { isAuth } = require("../../middleware/isAuth");
// const { rolAuth } = require("../../middleware/rolAuth");
// const { getUsers, getUserById, getUserByVehicle, postUser, putRollUser, putPasswordByUserName, putUser, addVehicleFromUser, removeVehicleFromUser, deleteUser } = require("../controllers/users");


// const usersRouter = require('express').Router();

// usersRouter.get('/:id', isAuth, idAuth, getUserById);
// usersRouter.get('/vehicles/:plate', isAuth, rolAuth('administrator'), getUserByVehicle);
// usersRouter.get('/', isAuth, rolAuth('administrator'), getUsers);
// usersRouter.post('/', isAuth, rolAuth('administrator'), postUser);
// usersRouter.put('/roll/:id', isAuth, rolAuth('administrator'), putRollUser);
// usersRouter.put('/password/:userName', isAuth, idAuth, putPasswordByUserName);
// usersRouter.put('/:id', isAuth, idAuth, putUser);
// usersRouter.put('/:id/vehicles', isAuth, rolAuth('administrator'), addVehicleFromUser);
// usersRouter.delete('/:idUser/vehicles/:idVehicle', isAuth, rolAuth('administrator'), removeVehicleFromUser,);
// usersRouter.delete('/:id', isAuth, idAuth, deleteUser);


// module.exports = usersRouter;