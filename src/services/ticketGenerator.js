

const Ticket = require('../api/models/tickets');
const qrGenerator = require('./qrGenerator');
const calculateFreePlaces = require('./CalculateFreePlaces');

const ticketGenerator = async (event, user, reservedPlaces) => {
     
     try {

          const freePlaces = calculateFreePlaces(event, reservedPlaces)
          
          const ticket = new Ticket({
               eventId: event._id,
               eventName: event.name,
               eventStatus: event.eventStatus,
               userId: user._id,
               userName: user.userName,
               reservedPlaces,
               ticketPrice: event.price * reservedPlaces
          });

          const qrData = {
               ticketId: ticket._id,
               image: event.image,
               eventName: event.name,
               userName: user.userName,
               reservedPlaces,
               startDate: event.startDate,
               endDate: event.endDate,
          };

          ticket.qrCode = await qrGenerator(qrData);

          await ticket.save();

          return ticket;

     } catch (error) {
          throw new Error(`error al generar el ticket: ${error.message}`);
     }
};

module.exports = ticketGenerator;
