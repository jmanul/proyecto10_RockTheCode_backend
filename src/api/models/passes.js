
const mongoose = require('mongoose');



const passSchema = new mongoose.Schema({

     eventId: { type: mongoose.Types.ObjectId, ref: 'events', required: [true, 'el ID del evento es obligatorio'] },
     namePass: { type: String, required: true, default: "general" },
     reservedPlaces: { type: Number, default: 1 },
     passPrice: { type: Number, default: 0 },
     maxCapacity: { type: Number, required: true },
     totalReservedPlaces: { type: Number, default: 0 },
     soldOut: { type: Boolean, default: false },
     color: { type: String, required: true, default: "white" },
     startDate: {
          type: Date, required: true, set: value => new Date(value), validate: {
               validator: value => value >= new Date(),
               message: 'la fecha de inicio no puede ser anterior a la actual'
          }
     },
     endDate: {
          type: Date, default: function () { return this.startDate; }, set: value => new Date(value), validate: {
               validator: function (value) {
                    return value >= this.startDate;
               },
               message: 'la fecha de finalización debe ser igual o posterior a la fecha de inicio'
          }
     }

},
     {
          timestamps: true,
          collection: 'passes'
     });


const Pass = mongoose.model('passes', passSchema, 'passes');

module.exports = Pass;