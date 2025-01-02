


// const User = require("../models/users");
// const Event = require("../models/events");


// const getUsers = async (req, res, next) => {

//      try {

//           const users = await User.find().populate({
//                path: 'events',
//                select: 'name startDate'
//           });

//           if (!users) {
//                return res.status(404).json({ message: 'usuarios no encontrados' });
//           }

//           return res.status(200).json(users);

//      } catch (error) {

//           return res.status(404).json(error);

//      }
// };


// const getUserById = async (req, res, next) => {

//      try {

//           const { id } = req.params;
//           const user = await User.findById(id).populate({
//                path: 'events',
//                select: 'name startDate'
//           });

//           if (!user) {
//                return res.status(404).json({ message: 'usuario no encontrado' });
//           }

//           return res.status(200).json(user);

//      } catch (error) {

//           return res.status(404).json(error);

//      }
// };