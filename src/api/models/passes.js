
const mongoose = require('mongoose');



const passSchema = new mongoose.Schema({

     eventId: { type: mongoose.Types.ObjectId, ref: 'events', required: [true, 'el ID del evento es obligatorio'] },
     namePass: { type: String, required: true, default: "general" },
     reservedPlacesPass: { type: Number, default: 1 },
     passPrice: { type: Number, default: 0 },
     maxCapacityPass: { type: Number, required: true },
     totalReservedPlacesPass: { type: Number, default: 0 },
     soldOutPass: { type: Boolean, default: false },
     color: { type: String, required: true, default: "white" },
     attendeesPass: [{ type: mongoose.Types.ObjectId, ref: 'users', required: false }],
     ticketsSoldPass: [{ type: mongoose.Types.ObjectId, ref: 'tickets', required: false }],
     startDatePass: { type: Date, required: true },
     endDatePass: { type: Date, required: true }
},

     {
          timestamps: true,
          collection: 'passes'
     });


const Pass = mongoose.model('passes', passSchema, 'passes');

module.exports = Pass;

