

const Ticket = require('../api/models/tickets');
const qrGenerator = require('./qrGenerator');
const calculateFreePlaces = require('./CalculateFreePlaces');

const ticketGenerator = async (pass, user, reservedPlaces) => {
     
     try {

          calculateFreePlaces(pass, reservedPlaces)

          const ticket = new Ticket({
               passId: pass._id,
               eventId: pass.eventId,
               userId: user._id,
               passName: pass.name,
               reservedPlaces,
               ticketPrice: pass.price * reservedPlaces
          });

          const apiBaseUrl = process.env.NODE_ENV === 'production' 
               ? 'https://proyecto10-rock-the-code-api-event.vercel.app/api/v2'
               : 'http://localhost:3000/api/v2';

          const qrData = {

               ticketUrl: `${apiBaseUrl}/tickets/${ticket._id}` 
              
          };

          ticket.qrCode = await qrGenerator(qrData);

          await ticket.save();

          return ticket;
          


     } catch (error) {
          throw new Error(`error al generar el ticket: ${error.message}`);
     }
};

module.exports = ticketGenerator;
