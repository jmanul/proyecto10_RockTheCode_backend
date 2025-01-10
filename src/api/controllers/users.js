
const deleteCloudinaryImage = require('../../utils/cloudinary/deleteCloudinaryImage');
const Ticket = require("../models/tickets");
const User = require("../models/users");
const Event = require("../models/events");
const ticketGenerator = require('../../services/ticketGenerator');

const bcrypt = require('bcrypt');

const getUsers = async (req, res, next) => {

     try {

          const users = await User.find().populate({
               path: 'eventsIds',
               select: 'name startDate'
          });

          if (!users) {
               return res.status(404).json({ message: 'usuarios no encontrados' });
          }

          return res.status(200).json(users);

     } catch (error) {

          return res.status(404).json({ error: error.message });

     }
};


const getUserById = async (req, res, next) => {

     try {

          const { UserId } = req.params;
          const user = await User.findById(UserId).populate({
               path: 'eventsIds',
               select: 'name startDate'
          });

          if (!user) {
               return res.status(404).json({ message: 'usuario no encontrado' });
          }

          return res.status(200).json(user);

     } catch (error) {

          return res.status(404).json({ error: error.message });

     }
};


const postUser = async (req, res, next) => {

     try {

          const { userName, email, eventsIds, ...rest } = req.body;
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

          if (req.file) {
               await deleteCloudinaryImage(req.file.path);
          }

          return res.status(404).json({ error: error.message });
     }

};

const putRollUser = async (req, res, next) => {

     try {

          const { UserId } = req.params;
          const { roll } = req.body;

          const updateData = { roll }

          const userUpdate = await User.findByIdAndUpdate(UserId, updateData, { new: true });

          if (!userUpdate) {
               return res.status(404).json({ message: 'usuario no encontrado' });
          }

          return res.status(200).json(userUpdate);

     } catch (error) {

          return res.status(404).json({ error: error.message });
     }
}

const putPasswordById = async (req, res, next) => {

     try {

          const { UserId } = req.params;
          const { password } = req.body;

          const user = await User.findById(UserId);

          if (!user) {
               return res.status(404).json({ message: 'Usuario no encontrado' });
          }

          if (password) {

               const hashedPassword = await bcrypt.hash(password, 10);
               req.body.password = hashedPassword;
          }

          const userUpdate = await User.findByIdAndUpdate(UserId, req.body, { new: true });

          return res.status(200).json(userUpdate);

     } catch (error) {

          return res.status(404).json({ error: error.message });
     }
}


const putUser = async (req, res, next) => {

     try {

          const { UserId } = req.params;
          const { email, userName, eventsIds, ...rest } = req.body;

          const updateData = { ...rest }

          const user = await User.findById(UserId);
          if (!user) {
               return res.status(404).json({ message: 'Usuario no encontrado' });
          }

          const existingUserName = await User.findOne({
               userName, _id: { $ne: UserId }
          });
          const existingUserEmail = await User.findOne({
               email, _id: { $ne: UserId }
          });

          if (existingUserEmail) {

               return res.status(400).json({ message: 'La dirección de correo electrónico ya está en uso.' });
          }


          if (existingUserName) {

               return res.status(400).json({ message: 'El nombre de usuario ya está en uso.' });
          }

          if (req.file) {

               await deleteCloudinaryImage(user.avatar);

               updateData.avatar = req.file.path;
          }

          if (email) updateData.email = email;
          if (userName) updateData.userName = userName;
          const userUpdate = await User.findByIdAndUpdate(UserId, updateData, { new: true });

          return res.status(200).json(userUpdate);


     } catch (error) {

          if (req.file) {
               await deleteCloudinaryImage(req.file.path);
          }

          return res.status(404).json({ error: error.message });
     }
};

const addEventsFromUser = async (req, res, next) => {

     try {
          const { UserId, eventId } = req.params;

          const { reservedPlaces } = req.body;


          const user = await User.findById(UserId);
          if (!user) {
               return res.status(404).json({ message: 'usuario no encontrado' });
          }

          const event = await Event.findById(eventId);
          if (!event) {
               return res.status(404).json({ message: 'evento no encontrado' });
          }

          const ticket = await ticketGenerator(event, user, reservedPlaces);

          
          const updatedUser = await User.findByIdAndUpdate(
               UserId,
               { $addToSet: { eventsIds: eventId, ticketsIds: ticket._id } },
               { new: true });
          
          await Event.findByIdAndUpdate(
               eventId,
               {
                    $addToSet: { attendees: UserId, ticketsSold: ticket._id },
                    $inc: { totalReservedPlaces: reservedPlaces }
               },
               { new: true }
          );

          return res.status(200).json({
               message: 'Evento añadido correctamente, ticket generado',
               ticket: ticket,
               updatedUser
          });

     } catch (error) {
          return res.status(500).json({ error: error.message });
     }


};


const removeEventFromUser = async (req, res, next) => {
     try {
          const { UserId, eventId } = req.params;

          const user = await User.findById(UserId);
          const event = await Event.findById(eventId);

          if (!user) {
               return res.status(404).json({ message: 'Usuario no encontrado' });
          }

          if (!event) {
               return res.status(404).json({ message: 'Evento no encontrado' });
          }

          if (user && event) {

               const userUpdate = await User.findByIdAndUpdate(
                    UserId,
                    { $pull: { eventsIds: eventId } },
                    { new: true }
               );

               const eventUpdate = await Event.findByIdAndUpdate(
                    eventId,
                    { $pull: { attendees: UserId } },
                    { new: true }
               );

               return res.status(200).json({
                    message: 'El Evento fue eliminado',
                    user: userUpdate,
                    eventsIds: eventUpdate
               });
          }



     } catch (error) {
          return res.status(404).json({ error: error.message });
     }
};


const deleteUser = async (req, res, next) => {

     try {

          const { UserId } = req.params;
          const user = await User.findById(UserId);

          if (!user) {
               return res.status(404).json({ message: 'usuario no encontrado' });
          }

          await deleteCloudinaryImage(user.avatar);

          await User.findByIdAndDelete(UserId);

          await Event.updateMany({ attendees: UserId }, { $pull: { attendees: UserId } });

          return res.status(200).json({
               message: 'El usuario fue eliminado',
               user: user
          });

     } catch (error) {

          return res.status(404).json({ error: error.message });

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


