

const cron = require('node-cron');
const Event = require('../../api/models/events'); 
const User = require('../../api/models/users'); 
const Ticket = require('../../api/models/tickets'); 


const cleanUpdateOldData = () => {

     // cron job que se ejecuta diariamente a la medianoche
     cron.schedule('0 0 * * *', async () => {
          try {
               console.log('Cron Job ejecutándose: Verificación de eventos');

               const currentDate = new Date();

               const updatedEvents = await Event.updateMany(
                    { endDate: { $lte: currentDate }, eventStatus: { $ne: 'finalized' } },
                    { $set: { eventStatus: 'finalized' } }
               );
               console.log(`eventos actualizados a finalizado: ${updatedEvents.modifiedCount}`);

               const cutoffDate = new Date();
               cutoffDate.setDate(cutoffDate.getDate() - 90); // han pasado 90 dias

               const eventsToDelete = await Event.find({ endDate: { $lte: cutoffDate }});

               for (const event of eventsToDelete) {
                    // eliminar tickets relacionados con el evento
                    const ticketsToDelete = await Ticket.find({ eventId: event._id });
                    const ticketsToDeleteIds = ticketsToDelete.map(ticket => ticket._id);

                    if (ticketsToDeleteIds.length > 0) {
                         await Ticket.deleteMany({ _id: { $in: ticketsToDeleteIds } });
                         console.log(`tickets eliminados: ${ticketsToDeleteIds.join(', ')}`);


                         await User.updateMany(
                              { ticketsIds: { $in: ticketsToDeleteIds } },
                              { $pull: { ticketsIds: { $in: ticketsToDeleteIds } } }
                         );
                         console.log(`Referencias de tickets al evento ${event.name}  eliminadas de los usuarios`);

                         await User.updateMany(
                              { eventsIds: event._id },
                              { $pull: { eventsIds: event._id } }
                         );
                         console.log(`Referencias al evento ${event.name} eliminadas de los usuarios`);
                    }   

                    await Event.findByIdAndDelete(event._id);
                    console.log(`evento ${event.name} eliminado`);
               }

               console.log('Cron Job completado exitosamente');
          } catch (error) {
               console.error('error en el Cron Job:', error.message);
          }
     });
};

module.exports = cleanUpdateOldData;

