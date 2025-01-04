const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({

     name: { type: String, required: true,  trim: true },
     type: {
          type: String, enum: [
               "Music",
               "Sport",
               "Party",
               "Training",
               "Others"
          ],
          required: true
     },
     location: { type: String, required: true,  trim: true },
     adress: { type: String, required: true,  trim: true },
     city: { type: String, required: true,  trim: true },
     description: { type: String, required: true,  trim: true },
     startDate: {type: Date, required: true, set: value => new Date(value), validate: {
               validator: value => value >= new Date(),
               message: 'La fecha de inicio no puede ser anterior a la actual'
          } },
     endDate: {
          type: Date, default: function () { return this.startDate; }, set: value => new Date(value), validate: {
               validator: function (value) {
                    return value >= this.startDate;
               },
               message: 'La fecha de finalización debe ser igual o posterior a la fecha de inicio.'
          }
},
     image: { type: String, default: "https://res.cloudinary.com/dn6utw1rl/image/upload/v1736008149/default/default-image-event_zk7dcu.webp"},
     attendees: [{ type: mongoose.Types.ObjectId, ref: 'users', required: false }],
     createdBy: { type: mongoose.Types.ObjectId, ref: 'users', default: "67784a087790d458a8eaef58", required: true }

},
     { 
          timestamps: true,
          collection: 'events'
     });

const Event = mongoose.model('events', eventSchema, 'events');

module.exports = Event;