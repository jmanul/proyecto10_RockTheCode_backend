

const User = require("../models/users");
const Event = require("../models/events");

const getUsers = async (req, res, next) => {

     try {

          const users = await User.find().populate({
               path: 'events',
               select: 'name startDate'
          });

          if (!users) {
               return res.status(404).json({ message: 'usuarios no encontrados' });
          }

          return res.status(200).json(users);

     } catch (error) {

          return res.status(404).json(error);

     }
};


const getUserById = async (req, res, next) => {

     try {

          const { id } = req.params;
          const user = await User.findById(id).populate({
               path: 'events',
               select: 'name startDate'
          });

          if (!user) {
               return res.status(404).json({ message: 'usuario no encontrado' });
          }

          return res.status(200).json(user);

     } catch (error) {

          return res.status(404).json(error);

     }
};


const postUser = async (req, res, next) => {

     try {

          const { email, avatar, ...rest } = req.body;

          const existUser = await User.findOne({ userName });

          if (existUser) {
               return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
          }

               if (req.file) {

                    avatar = req.file.path;
               }

               const newUser = await User.create({
                    email,
                    avatar,
                    ...rest
               });

              
               return res.status(201).json({
                    message: 'usuario creado correctamente',
                    user: newUser
               });


     } catch (error) {

          return res.status(404).json(error);
     }

};

// const putRollUser = async (req, res, next) => {

//      try {

//           const { id } = req.params;
//           const { roll } = req.body;

//           const updateData = { roll }

//           const userUpdate = await User.findByIdAndUpdate(id, updateData, { new: true });

//           if (!userUpdate) {
//                return res.status(404).json({ message: 'usuario no encontrado' });
//           }

//           return res.status(200).json(userUpdate);

//      } catch (error) {

//           return res.status(404).json(error);
//      }
// }

// const putPasswordByUserName = async (req, res, next) => {

//      try {

//           const { userName } = req.params;
//           const { password } = req.body;

//           const user = await User.findOne({ userName });

//           if (!user) {
//                return res.status(404).json({ message: 'Usuario no encontrado' });
//           }

//           const id = user._id.toString();

//           const updateData = {};

//           if (password) {

//                const hashedPassword = await bcrypt.hash(password, 10);
//                updateData.password = hashedPassword;
//           }

//           const userUpdate = await User.findByIdAndUpdate(id, updateData, { new: true });

//           return res.status(200).json(userUpdate);

//      } catch (error) {

//           return res.status(404).json(error);
//      }
// }


// const putUser = async (req, res, next) => {

//      try {

//           const { id } = req.params;
//           const { vehicles, password, roll, userName, ...rest } = req.body;

//           const updateData = { ...rest }

//           if (password) {
//                const hashedPassword = await bcrypt.hash(password, 10);
//                updateData.password = hashedPassword;
//           }

//           const userUpdate = await User.findByIdAndUpdate(id, updateData, { new: true });

//           if (!userUpdate) {
//                return res.status(404).json({ message: 'usuario no encontrado' });
//           }

//           return res.status(200).json(userUpdate);


//      } catch (error) {

//           return res.status(404).json(error);
//      }
// };

// const addVehicleFromUser = async (req, res, next) => {

//      try {

//           const { id } = req.params;
//           const { vehicles: newVehicles } = req.body;

//           let validVehiclesIds = [];

//           if (newVehicles) {

//                const validVehicles = await Vehicle.find({ _id: { $in: newVehicles } });

//                validVehiclesIds = validVehicles.map(vehicle => vehicle._id.toString());
//           }

//           // añadimos los nuevos vehiculos si los hay y actualizamos

//           let updatedUser;

//           if (validVehiclesIds.length > 0) {

//                updatedUser = await User.findByIdAndUpdate(id, {
//                     $addToSet: { vehicles: { $each: validVehiclesIds } },
//                }, { new: true }).populate({
//                     path: 'vehicles',
//                     select: 'plate brand model engine',
//                });


//                if (!updatedUser) {
//                     return res.status(404).json({ message: 'Usuario no encontrado' });
//                }
//           }

//           return res.status(200).json({ message: 'Vehículos añadidos con éxito', updatedUser });

//      } catch (error) {

//           return res.status(404).json(error);

//      }
// }

// const removeVehicleFromUser = async (req, res, next) => {
//      try {
//           const { idUser, idVehicle } = req.params;


//           const userUpdate = await User.findByIdAndUpdate(
//                idUser,
//                { $pull: { vehicles: idVehicle } },
//                { new: true }
//           );

//           if (!userUpdate) {
//                return res.status(404).json({ message: 'usuario no encontrado' });
//           }

//           return res.status(200).json({
//                message: 'El vehiculo fue eliminado',
//                vehicle: idVehicle,
//                user: userUpdate
//           });

//      } catch (error) {
//           return res.status(404).json(error);
//      }
// };


// const deleteUser = async (req, res, next) => {

//      try {

//           const { id } = req.params;
//           const userDelete = await User.findByIdAndDelete(id);

//           if (!userDelete) {
//                return res.status(404).json({ message: 'usuario no encontrado' });
//           }

//           return res.status(200).json({
//                message: 'El usuario fue eliminado',
//                user: userDelete
//           });

//      } catch (error) {

//           return res.status(404).json(error);

//      }
// };


module.exports = {

     getUsers,
     getUserById,
     postUser,
//      putRollUser,
//      putPasswordByUserName,
//      putUser,
//      addVehicleFromUser,
//      removeVehicleFromUser,
//      deleteUser
};