

const mongoose = require('mongoose');



const ticketSchema = new mongoose.Schema({

     eventId: { type: mongoose.Types.ObjectId, ref: 'events', required: true },
     eventName: { type: String, required: true, trim: true },
     userId: { type: mongoose.Types.ObjectId, ref: 'users', required: true },
     userName: { type: String, required: true, trim: true },
     reservedPlaces: { type: Number, default: 1 },
     ticketPrice: { type: Number, default: 0},
     qrCode: { type: String }, 
     ticketStatus: {
          type: String, default: "unused", enum: [
               "unused",
               "used",
               "vip-unused",
               "vip-used",
               "finalized"
          ]
     },
     createdAt: { type: Date, default: Date.now }

},
     {
          timestamps: true,
          collection: 'tickets'
     });


const Ticket = mongoose.model('tickets', ticketSchema, 'tickets');

module.exports = Ticket;