const mongoose = require('mongoose');
const { countries } = require('../../data/countries');

const eventSchema = new mongoose.Schema({

     name: { type: String, required: true, trim: true },
     type: {
          type: String, default: "otros", enum: [
               "musica",
               "deporte",
               "fiesta",
               "formación",
               "arte",
               "gastronomía",
               "tecnología",
               "otros"
          ]
     },
     slug: {
          type: String, default: function () {
               return this.type.normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
          }
     },
     location: { type: String, required: true, trim: true },
     address: { type: String, required: true, trim: true },
     postalCode: { type: String, required: true, trim: true },
     city: { type: String, required: true, trim: true },
     country: {
          name: {
               type: String,
               default: "España"
          },
          code: {
               type: String,
               default: "ES"
          }
     },

     fullAddress: {
          type: String,
          default: function () {
               // Se construye automáticamente al crear
               return [
                    this.address,
                    this.location,
                    this.city,
                    this.postalCode,
                    this.country.code
               ]
                    .filter(Boolean)
                    .map(p => String(p).trim())
                    .join(', ');
          }
     },
     description: { type: String, required: true, trim: true },
     startDate: {
          type: Date,
          required: true,
          set: value => new Date(value),
          validate: {
               validator: value => {
                    const now = new Date();
                    now.setSeconds(0, 0); // ignora segundos y ms
                    return value >= now;
               },
               message: 'La fecha de inicio no puede ser anterior a la actual',
          }
     }
     ,
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
     image: {
          type: String, default: function () {
               return `https://res.cloudinary.com/dn6utw1rl/image/upload/v1739241182/default/${this.type}.webp`;
          }
     },
     createdBy: { type: mongoose.Types.ObjectId, ref: 'users', default: "67aa5f62e4d1301e1cccbb17", required: false },
     soldOut: { type: Boolean, default: false },
     maxCapacity: { type: Number, required: false, default: 0 },
     totalReservedPlaces: { type: Number, default: 0 },
     attendees: [{ type: mongoose.Types.ObjectId, ref: 'users', required: false }],
     passesOfferedIds: [{ type: mongoose.Types.ObjectId, ref: 'passes', required: false }],
     ticketsSold: [{ type: mongoose.Types.ObjectId, ref: 'tickets', required: false }],
     isPrivated: { type: Boolean, default: false }

},
     {
          timestamps: true,
          collection: 'events'
     });


const Event = mongoose.model('events', eventSchema, 'events');

module.exports = Event;