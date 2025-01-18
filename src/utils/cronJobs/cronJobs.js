

const cron = require('node-cron');
const Event = require('../../api/models/events'); 
const Ticket = require('../../api/models/tickets'); 


const cleanUpdateOldData = () => {

     // cron job que se ejecuta diariamente a la medianoche
     cron.schedule('0 0 * * *', async () => {
          try {
               console.log('Cron Job ejecutándose: Verificación de eventos');

               const currentDate = new Date();

               const updatedEvents = await Event.updateMany(
                    { endDate: { $lte: currentDate }, status: { $ne: 'finalized' } },
                    { $set: { status: 'finalized' } }
               );
               console.log(`eventos actualizados a finalizado: ${updatedEvents.modifiedCount}`);

               const cutoffDate = new Date();
               cutoffDate.setDate(cutoffDate.getDate() - 90); // han pasado 90 dias

               const eventsToDelete = await Event.find({ endDate: { $lte: cutoffDate }, status: 'finalized' });

               for (const event of eventsToDelete) {
                    // eliminar tickets relacionados con el evento

                    await Ticket.deleteMany({ eventId: event._id });

                    await Event.findByIdAndDelete(event._id);
                    console.log(`evento eliminado: ${event._id}`);
               }

               console.log('Cron Job completado exitosamente');
          } catch (error) {
               console.error('error en el Cron Job:', error.message);
          }
     });
};

module.exports = cleanUpdateOldData;

