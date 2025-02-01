
const deleteCloudinaryImage = require('../../utils/cloudinary/deleteCloudinaryImage');
const Ticket = require("../models/tickets");
const User = require("../models/users");
const Event = require("../models/events");
const Pass = require("../models/passes");
const ticketGenerator = require('../../services/ticketGenerator');
const calculateFreePlaces = require('../../services/ticketGenerator');

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

          const { userId } = req.params;
          const user = await User.findById(userId).populate({
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

const putPasswordById = async (req, res, next) => {

     try {

          const { userId } = req.params;
          const { password } = req.body;

          const user = await User.findById(userId);

          if (!user) {
               return res.status(404).json({ message: 'Usuario no encontrado' });
          }

          if (password) {

               const hashedPassword = await bcrypt.hash(password, 10);
               req.body.password = hashedPassword;
          }

          const userUpdate = await User.findByIdAndUpdate(userId, req.body, { new: true });

          return res.status(200).json(userUpdate);

     } catch (error) {

          return res.status(404).json({ error: error.message });
     }
}


const putUser = async (req, res, next) => {

     try {

          const { userId } = req.params;
          const { email, userName, eventsIds, ...rest } = req.body;

          const updateData = { ...rest }

          const user = await User.findById(userId);
          if (!user) {
               return res.status(404).json({ message: 'Usuario no encontrado' });
          }

          const existingUserName = await User.findOne({
               userName, _id: { $ne: userId }
          });
          const existingUserEmail = await User.findOne({
               email, _id: { $ne: userId }
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
          const userUpdate = await User.findByIdAndUpdate(userId, updateData, { new: true });

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
          const { userId, passId } = req.params;

          const { reservedPlaces } = req.body;

          const user = await User.findById(userId);
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
                    userId,
                    { $addToSet: { passesIds: passId, eventsIds: pass.eventId, ticketsIds: ticket._id } },
                    { new: true });

               updatedEvent = await Event.findByIdAndUpdate(
                    pass.eventId,
                    {
                         $addToSet: { attendees: userId, ticketsSold: ticket._id },
                         $inc: { totalReservedPlaces: 1 },

                    },
                    { new: true }
               );
               
               updatedPass = await Pass.findByIdAndUpdate(
                    passId,
                    {
                         $addToSet: { attendeesPass: userId, ticketsSoldPass: ticket._id },
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
          const { userId, passId } = req.params;

          const user = await User.findById(userId);
          const pass = await Event.findById(passId);

          if (!user) {
               return res.status(404).json({ message: 'Usuario no encontrado' });
          }

          if (!pass) {
               return res.status(404).json({ message: 'entrada no encontrada' });
          }

          if (pass.passPrice > 0) {
               return res.status(404).json({ message: 'la entrada no se pueden cancelar' });
          }

          const tickets = await Ticket.find({ userId, passId });

          const totalReservedPlacesToReturn = tickets.reduce(
               (sum, ticket) => sum + ticket.passId.reservedPlacesPass,
               0
          );

          const cancelledTickets = await Ticket.updateMany(
               { userId, passId },
               { ticketStatus: 'cancelled' }
          );

               const userUpdate = await User.findByIdAndUpdate(
                    userId,
                    { $pull: { eventsIds: pass.eventId, passesIds: passId } },
                    { new: true }
               );

               const eventUpdate = await Event.findByIdAndUpdate(
                    pass.eventId,
                    {
                         $pull: { attendees: userId },
                         $inc: { totalReservedPlaces: -totalReservedPlacesToReturn }
                    },
                    { new: true }
          );
          
          const passUpdate = await Pass.findByIdAndUpdate(
                    passId,
                    {
                         $pull: { attendeesPass: userId },
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

          const { userId } = req.params;
          const user = await User.findById(userId);

          if (!user) {
               return res.status(404).json({ message: 'usuario no encontrado' });
          }

          const activeEvents = await Event.find({
               attendees: userId,
               endDate: { $gte: new Date() }
          });

          if (activeEvents.length > 0) {
               return res.status(400).json({
                    message: 'no puedes eliminar tu cuenta mientras tengas eventos sin finalizar',
                    activeEvents,
               });
          }

          await deleteCloudinaryImage(user.avatar);

          await User.findByIdAndDelete(userId);

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
     addPassFromUser,
     removePassFromUser,
     deleteUser
};


