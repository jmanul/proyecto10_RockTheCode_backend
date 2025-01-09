

const mongoose = require('mongoose');



const ticketSchema = new mongoose.Schema({

     event: {  type: mongoose.Types.ObjectId, ref: 'events', required: true },
     user: {  type: mongoose.Types.ObjectId, ref: 'users', required: true },
     reservedPlaces: { type: Number, default: 1 },
     ticketPrice: { type: Number,  default:0,  required: true }

},
     {
          timestamps: true,
          collection: 'tickets'
     });


const Ticket = mongoose.model('tickets', ticketSchema, 'tickets');

module.exports = Ticket;