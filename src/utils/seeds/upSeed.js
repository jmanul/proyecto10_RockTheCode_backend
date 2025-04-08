
require("dotenv").config();
const mongoose = require("mongoose");
const Event = require('../../api/models/events');
const User = require('../../api/models/users');
const Ticket = require('../../api/models/tickets');
const Pass = require('../../api/models/passes');

const eventDate = require('../../data/events');


const upSeed = async () => {
     try {
         
          await mongoose.connect(process.env.DDBB_URL);

          // Limpiar colecciones
          await Pass.deleteMany({});
          console.log('Entradas eliminadas');
          await Event.deleteMany({});
          console.log('Eventos eliminados');
          await Ticket.deleteMany({});
          console.log('Tickets eliminados');

          // resetear campos relacionados en usuarios
          const updatedUsers = await User.updateMany(
               { $or: [{ ticketsIds: { $exists: true } }, { eventsIds: { $exists: true } }, { passesIds: { $exists: true } }] },
               { $set: { ticketsIds: [], eventsIds: [], passesIds: [] } }
          );
          console.log(`Usuarios actualizados: ${updatedUsers.modifiedCount}`);

          // insertar eventos y obtener IDs generados
          const insertedEvents = await Event.insertMany(eventDate);
          console.log('Eventos insertados');
          
          const passesToInsert = [];
          
          // crear entradas asociadas a cada evento
          for (const event of insertedEvents) {
               const pass = {
                    eventId: event._id, 
                    maxCapacityPass: event.maxCapacity,
                    startDatePass: event.startDate,
                    endDatePass: event.endDate
               };

               console.log(`Entradas creadas para el evento: ${event.name}`);

               passesToInsert.push(pass);

          };

          // insertar las entradas 
          const passesInsert = await Pass.insertMany(passesToInsert);
          //añadir las entradas a sus eventos
          for (const pass of passesInsert) {

              const event = await Event.findByIdAndUpdate(
                         pass.eventId,
                         {
                              $addToSet: { passesOfferedIds: pass._id }
                         },
                         { new: true }
               )
              console.log(`entrada ${pass.namePass} añadido a ${event.name}`)     
          };

          await mongoose.disconnect();
          console.log("Desconectado");
     } catch (error) {
          console.error(error);
     }
};

upSeed();