const Ticket = require("../models/tickets");
const User = require("../models/users");
const Event = require("../models/events");
const ticketGenerator = require('../../services/ticketGenerator');
const qrGenerator = require('../../services/qrGenerator');

const postTicket = async (req, res, next) => {

     try {

          const { userId, eventId, reservedPlaces, ...rest } = req.body;
        

          const event = await Event.findById( eventId );

          if (!event) {
               return res.status(400).json({ message: 'El evento no existe' });
          }
          const user = await User.findById( userId );

          if (!user) {
               return res.status(400).json({ message: 'El usuario no existe' });


          }


          const ticket = await ticketGenerator(event, user, reservedPlaces);

          await User.findByIdAndUpdate(
               user,
               { $addToSet: { eventsIds: eventId, ticketsIds: ticket._id } },
               { new: true });

          await Event.findByIdAndUpdate(
               event,
               {
                    $addToSet: { attendees: userId, ticketsSold: ticket._id },
                    $inc: { totalReservedPlaces: reservedPlaces }
               },
               { new: true }
          );

          return res.status(201).json({
               message: 'ticket creado correctamente',
               user: ticket
          });


     } catch (error) {

          return res.status(404).json({ error: error.message });
     }

};

module.exports = {

      postTicket
};