

const mongoose = require('mongoose');



const ticketSchema = new mongoose.Schema({

     eventId: { type: mongoose.Types.ObjectId, ref: 'events', required: true },
     userId: { type: mongoose.Types.ObjectId, ref: 'users', required: true },
     passId: { type: mongoose.Types.ObjectId, ref: 'passes', required: true },
     qrCode: { type: String, required: true }, 
     ticketStatus: {
          type: String, default: "unused", enum: [
               "unused",
               "used",
               "cancelled"
          ]
     }

},
     {
          timestamps: true,
          collection: 'tickets'
     });


const Ticket = mongoose.model('tickets', ticketSchema, 'tickets');

module.exports = Ticket;