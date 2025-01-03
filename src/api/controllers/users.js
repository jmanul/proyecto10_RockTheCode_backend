
const deleteCloudinaryImage = require('../../utils/cloudinary/deleteCloudinaryImage');

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

          const { userName, email,...rest } = req.body;
          let avatar;

          const existUser = await User.findOne({ userName });
          const existEmail = await User.findOne({ email });

          if (existUser) {
               return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
          }
          if (existEmail) {
               return res.status(400).json({ message: 'la dirección de correo electronico existe o no es valida' });
          }

               if (req.file) {

                    avatar = req.file.path;
               }

          const newUser = await User.create({
                    userName,
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

const putRollUser = async (req, res, next) => {

     try {

          const { id } = req.params;
          const { roll } = req.body;

          const updateData = { roll }

          const userUpdate = await User.findByIdAndUpdate(id, updateData, { new: true });

          if (!userUpdate) {
               return res.status(404).json({ message: 'usuario no encontrado' });
          }

          return res.status(200).json(userUpdate);

     } catch (error) {

          return res.status(404).json(error);
     }
}

const putPasswordById = async (req, res, next) => {

     try {

          const { id } = req.params;
          const { password } = req.body;

          const updateData = { password };

          const user = await User.findOne({ id });

          if (!user) {
               return res.status(404).json({ message: 'Usuario no encontrado' });
          }

          if (password) {

               const hashedPassword = await bcrypt.hash(password, 10);
               updateData.password = hashedPassword;
          }

          const userUpdate = await User.findByIdAndUpdate(id, updateData, { new: true });

          return res.status(200).json(userUpdate);

     } catch (error) {

          return res.status(404).json(error);
     }
}


const putUser = async (req, res, next) => {

     try {

          const { id } = req.params;
          const { password, events, email, userName, ...rest } = req.body;

          const updateData = { ...rest }

          const existingUser = await User.findOne({
               $or: [{ email }, { userName }],
               _id: { $ne: id }, // Excluir el usuario actual
          });

          if (existingUser) {
               if (existingUser.email === email) {
                    return res.status(400).json({ message: 'La dirección de correo electrónico ya está en uso.' });
               }
               if (existingUser.userName === userName) {
                    return res.status(400).json({ message: 'El nombre de usuario ya está en uso.' });
               }
          }

          if (req.file) {

               await deleteCloudinaryImage(updateData.avatar);

               updateData.avatar = req.file.path;
          }

          if (email) updateData.email = email;
          if (userName) updateData.userName = userName;
          const userUpdate = await User.findByIdAndUpdate(id, updateData, { new: true });

          if (!userUpdate) {
               return res.status(404).json({ message: 'usuario no encontrado' });
          }

          return res.status(200).json(userUpdate);


     } catch (error) {

          return res.status(404).json(error);
     }
};

const addEventsFromUser = async (req, res, next) => {

     try {

          const { id } = req.params;
          const { events: newEvents } = req.body;

          let validEventsIds = [];

          if (newEvents) {

               const validEvents = await Event.find({ _id: { $in: newEvents } });

               validEventsIds = validEvents.map(event => event._id.toString());
          }

          // añadimos los nuevos eventos si los hay y actualizamos

          let updatedUser;

          if (validEventsIds.length > 0) {

               updatedUser = await User.findByIdAndUpdate(id, {
                    $addToSet: { events: { $each: validEventsIds } },
               }, { new: true }).populate({
                    path: 'events',
                    select: 'name type startDate endDate',
               });


               if (!updatedUser) {
                    return res.status(404).json({ message: 'Usuario no encontrado' });
               }
          }

          return res.status(200).json({ message: 'Eventos añadidos con éxito', updatedUser });

     } catch (error) {

          return res.status(404).json(error);

     }
}

const removeEventFromUser = async (req, res, next) => {
     try {
          const { idUser, idEvent } = req.params;


          const userUpdate = await User.findByIdAndUpdate(
               idUser,
               { $pull: { events: idEvent } },
               { new: true }
          );

          await Event.findByIdAndUpdate(
               idEvent,
               { $pull: { attendees: idUser } },
               { new: true }
          );

          if (!userUpdate) {
               return res.status(404).json({ message: 'usuario no encontrado' });
          }

          return res.status(200).json({
               message: 'El Evento fue eliminado',
               events: idEvent,
               user: userUpdate
          });

     } catch (error) {
          return res.status(404).json(error);
     }
};


const deleteUser = async (req, res, next) => {

     try {

          const { id } = req.params;
          const user = await User.findById(id);

          if (!user) {
               return res.status(404).json({ message: 'usuario no encontrado' });
          }

          await deleteCloudinaryImage(user.avatar);

          await User.findByIdAndDelete(id);

          await Event.updateMany({ attendees: id }, { $pull: { attendees: id } });

          return res.status(200).json({
               message: 'El usuario fue eliminado',
               user: userDelete
          });

     } catch (error) {

          return res.status(404).json(error);

     }
};


module.exports = {

     getUsers,
     getUserById,
     postUser,
     putRollUser,
     putPasswordById,
     putUser,
     addEventsFromUser,
     removeEventFromUser,
     deleteUser
};