

//const cron = require('node-cron');
const Event = require('../../api/models/events');
const Pass = require('../../api/models/passes');
const User = require('../../api/models/users');
const Ticket = require('../../api/models/tickets');


const cleanUpdateOldData = async () => {

     // cron job que se ejecuta diariamente a la medianoche   cron.schedule('0 0 * * *', async () => {

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

          const passToDelete = await Pass.find({ endDatePass: { $lte: cutoffDate } });

          for (const pass of passToDelete) {

               const ticketsToDelete = await Ticket.find({ passId: pass._id });
               const ticketsToDeleteIds = ticketsToDelete.map(ticket => ticket._id);

               if (ticketsToDeleteIds.length > 0) {

                    console.log(`tickets eliminados: ${ticketsToDeleteIds.join(', ')}`);

                    await User.updateMany(
                         { ticketsIds: { $in: ticketsToDeleteIds } },
                         { $pull: { ticketsIds: { $in: ticketsToDeleteIds } } }
                    );

                    await Ticket.deleteMany({ _id: { $in: ticketsToDeleteIds } });
               
                    console.log(`Referencias de tickets a la entrada ${pass.namePass}  eliminadas de los usuarios`);

                    await User.updateMany(
                         { passesIds: pass._id },
                         { $pull: { passesIds: pass._id } }
                    );
                    console.log(`Referencias a entrada eliminadas de los usuarios`);
               }

               await Pass.findByIdAndDelete(pass._id);
               console.log(`entrada eliminada`);
          };

          const eventsToDelete = await Event.find({ endDate: { $lte: cutoffDate } });

          for (const event of eventsToDelete) {

               await User.updateMany(
                    { eventsIds: event._id },
                    { $pull: { eventsIds: event._id } }
               );
               console.log(`Referencias a evento eliminadas de los usuarios`);

               await Event.findByIdAndDelete(event._id);
               console.log(`evento ${event.name} eliminado`);
          }

          console.log('Cron Job completado exitosamente');


     } catch (error) {

          console.error('Error en el Cron Job:', error.message);
          throw error;

     }
     //   });
};

module.exports = { cleanUpdateOldData }

