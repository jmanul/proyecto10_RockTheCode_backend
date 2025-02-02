const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({

     name: { type: String, required: true, trim: true },
     type: {
          type: String, default: "others", enum: [
               "music",
               "sport",
               "party",
               "training",
               "art",
               "gastronomy",
               "technology",
               "others"
          ]
     },
     location: { type: String, required: true, trim: true },
     adress: { type: String, required: true, trim: true },
     city: { type: String, required: true, trim: true },
     description: { type: String, required: true, trim: true },
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
     },
     eventStatus: {
          type: String, default: "not-start", enum: [
               "not-start",
               "postponed",
               "cancelled",
               "finalized"
          ]
     },
     image: { type: String, default: "https://res.cloudinary.com/dn6utw1rl/image/upload/v1736008149/default/default-image-event_zk7dcu.webp" },
     createdBy: { type: mongoose.Types.ObjectId, ref:'users',default:"67784a087790d458a8eaef58", required: true },
     soldOut: { type: Boolean, default: false },
     maxCapacity: { type: Number, required: true },
     totalReservedPlaces: { type: Number, default: 0 },
     attendees: [{ type: mongoose.Types.ObjectId, ref: 'users', required: false }],
     passesOfferedIds: [{ type: mongoose.Types.ObjectId, ref: 'passes', required: false }],
     ticketsSold: [{ type: mongoose.Types.ObjectId, ref: 'tickets', required: false }]

},
     {
          timestamps: true,
          collection: 'events'
     });

const Event = mongoose.model('events', eventSchema, 'events');

module.exports = Event;