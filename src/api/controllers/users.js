
const deleteCloudinaryImage = require('../../utils/cloudinary/deleteCloudinaryImage');
const Ticket = require("../models/tickets");
const User = require("../models/users");
const Event = require("../models/events");
const Pass = require("../models/passes");
const ticketGenerator = require('../../services/ticketGenerator');


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

          const userId  = req.user._id;
          const user = await User.findById(userId).populate({
               path: 'eventsIds',
               select: 'name startDate'
          });

          return res.status(200).json({ isAuth: true, user });

     } catch (error) {

          res.status(404).json({ error: error.message });

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

          const { userId } = req.params;
          const { roll } = req.body;

          const updateData = { roll }

          const userUpdate = await User.findByIdAndUpdate(userId, updateData, { new: true });

          if (!userUpdate) {
               return res.status(404).json({ message: 'usuario no encontrado' });
          }

          return res.status(200).json(userUpdate);

     } catch (error) {

          return res.status(404).json({ error: error.message });
     }
}


const putUser = async (req, res, next) => {

     try {

          const { email, userName, eventsIds, ...rest } = req.body;

          const updateData = { ...rest }

          const user = await User.findById(req.user._id);
          if (!user) {
               return res.status(404).json({ message: 'Usuario no encontrado' });
          }

          if (userName) {

               const existingUserName = await User.findOne({
                    userName, _id: { $ne: user._id }
               });


               if (existingUserName) {

                    return res.status(400).json({ message: 'El nombre de usuario ya está en uso.' });
               }

               updateData.userName = userName;
          }


          if (email) {

               const existingUserEmail = await User.findOne({
                    email, _id: { $ne: user._id }
               });

               if (existingUserEmail) {

                    return res.status(400).json({ message: 'La dirección de correo electrónico ya está en uso.' });
               }

               updateData.email = email;
          }


          if (req.file) {

               await deleteCloudinaryImage(user.avatar);

               updateData.avatar = req.file.path;
          }


          const userUpdate = await User.findByIdAndUpdate(user._id, updateData, { new: true });

          return res.status(200).json(userUpdate);


     } catch (error) {

          if (req.file) {
               await deleteCloudinaryImage(req.file.path);
          }

          return res.status(404).json({ error: error.message });
     }
};

const addPassFromUser = async (req, res, next) => {

     try {
          const { passId } = req.params;

          const { reservedPlaces } = req.body;

          const user = await User.findById(req.user._id);
          if (!user) {
               return res.status(404).json({ message: 'usuario no encontrado' });
          }

          const pass = await Pass.findById(passId);
          if (!pass) {
               return res.status(404).json({ message: 'entrada no encontrada' });
          }

          let updatedEvent = {};
          let updatedUser = {};
          let updatedPass = {};
          let ticket = {};
          const ticketsList = [];

          for (let element = 0; element < reservedPlaces; element++) {

               ticket = await ticketGenerator(pass, user, 1);

               ticketsList.push(ticket)

               updatedUser = await User.findByIdAndUpdate(
                    user._id,
                    { $addToSet: { passesIds: passId, eventsIds: pass.eventId, ticketsIds: ticket._id } },
                    { new: true });

               updatedEvent = await Event.findByIdAndUpdate(
                    pass.eventId,
                    {
                         $addToSet: { attendees: user._id, ticketsSold: ticket._id, },
                         $inc: { totalReservedPlaces: 1 },

                    },
                    { new: true }
               );

               updatedPass = await Pass.findByIdAndUpdate(
                    passId,
                    {
                         $addToSet: { attendeesPass: user._id, ticketsSoldPass: ticket._id },
                         $inc: { totalReservedPlacesPass: 1 },

                    },
                    { new: true }
               );
          }

          if (updatedEvent.totalReservedPlaces >= updatedEvent.maxCapacity) {
               await Event.findByIdAndUpdate(
                    pass.eventId,
                    { soldOut: true },
                    { new: true }
               );
          }

          if (updatedPass.totalReservedPlacesPass >= updatedPass.maxCapacityPass) {
               await Pass.findByIdAndUpdate(
                    passId,
                    { soldOut: true },
                    { new: true }
               );
          }

          return res.status(200).json({
               message: 'Evento añadido correctamente, ticket generado',
               ticket: ticketsList,
               user: updatedUser,
               event: updatedEvent
          });

     } catch (error) {
          return res.status(500).json({ error: error.message });
     }


};


const removePassFromUser = async (req, res, next) => {
     try {
          const { passId } = req.params;

          const user = await User.findById(req.user._id);
          const pass = await Pass.findById(passId);

          if (!user) {
               return res.status(404).json({ message: 'Usuario no encontrado' });
          }

          if (!pass) {
               return res.status(404).json({ message: 'entrada no encontrada' });
          }

          if (pass.passPrice > 0) {
               return res.status(404).json({ message: 'la entrada no se pueden cancelar' });
          }

          const tickets = await Ticket.find({ userId: user._id, passId, ticketStatus: "unused" });

          const totalReservedPlacesToReturn = tickets.length;

          const cancelledTickets = await Ticket.updateMany(
               { userId: user._id, passId },
               { ticketStatus: 'cancelled' }
          );

          const userUpdate = await User.findByIdAndUpdate(
               user._id,
               { $pull: { eventsIds: pass.eventId, passesIds: passId } },
               { new: true }
          );

          const eventUpdate = await Event.findByIdAndUpdate(
               pass.eventId,
               {
                    $pull: { attendees: user._id },
                    $inc: { totalReservedPlaces: -totalReservedPlacesToReturn }
               },
               { new: true }
          );

          const passUpdate = await Pass.findByIdAndUpdate(
               passId,
               {
                    $pull: { attendeesPass: user._id },
                    $inc: { totalReservedPlacesPass: -totalReservedPlacesToReturn }
               },
               { new: true }
          );


          return res.status(200).json({
               message: 'El Evento fue eliminado',
               user: userUpdate,
               event: eventUpdate,
               pass: passUpdate,
               cancelledTickets
          });

     } catch (error) {
          return res.status(404).json({ error: error.message });
     }
};


const deleteUser = async (req, res, next) => {

     try {

          const user = await User.findById(req.user._id);

          if (!user) {
               return res.status(404).json({ message: 'usuario no encontrado' });
          }

          const activeTickets = await Ticket.find({

               userId: user._id,
               ticketStatus: "unused"

          });


          if (activeTickets.length > 0) {
               return res.status(400).json({
                    message: 'no puedes eliminar tu cuenta mientras tengas eventos sin finalizar',
                    activeTickets,
               });
          }

          res.clearCookie('accessToken');
          res.clearCookie('refreshToken');

          await deleteCloudinaryImage(user.avatar);

          await User.findByIdAndDelete(user._id);

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
     putUser,
     addPassFromUser,
     removePassFromUser,
     deleteUser
};


