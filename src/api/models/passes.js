
const mongoose = require('mongoose');
const { toBoolean } = require('../../utils/toBoolean');


const passSchema = new mongoose.Schema({

     eventId: { type: mongoose.Types.ObjectId, ref: 'events', required: [true, 'el ID del evento es obligatorio'] },
     namePass: { type: String, required: true, default: "general" },
     descriptionPass: { type: String, required: false, trim: true },
     reservedPlacesPass: { type: Number, default: 1 },
     passPrice: { type: Number, default: 0 },
     maxCapacityPass: { type: Number, required: true },
     totalReservedPlacesPass: { type: Number, default: 0 },
     soldOutPass: { type: Boolean, default: false },
     color: { type: String, required: true, default: "white" },
     attendeesPass: [{ type: mongoose.Types.ObjectId, ref: 'users', required: false }],
     ticketsSoldPass: [{ type: mongoose.Types.ObjectId, ref: 'tickets', required: false }],
     startDatePass: { type: Date, required: true },
     endDatePass: { type: Date, required: true },
     
     // Sistema de passes privados con lista de invitados
     isPrivated: { type: Boolean, default: false, set: toBoolean },
     
     // Lista de invitados con límite de entradas por usuario
     guestList: [{
          userName: { type: String, required: true, trim: true }, // Nombre de usuario
          maxTickets: { type: Number, default: 1, min: 1 }, // Máximo de entradas que puede obtener
          ticketsObtained: { type: Number, default: 0 }, // Entradas ya obtenidas
          userId: { type: mongoose.Types.ObjectId, ref: 'users' } // Referencia al usuario (se asigna al validar)
     }],
     
     // Creador del pass (para poder editar la lista de invitados)
     createdBy: { type: mongoose.Types.ObjectId, ref: 'users' }
},

     {
          timestamps: true,
          collection: 'passes'
     });


const Pass = mongoose.model('passes', passSchema, 'passes');

module.exports = Pass;