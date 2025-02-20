
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

          await Pass.deleteMany({});
          console.log('entradas eliminadas');
          await Event.deleteMany({});
          console.log('eventos eliminados');
          await Ticket.deleteMany({});
          console.log('tickets eliminados');

          const updatedUsers = await User.updateMany(
               { $or: [{ ticketsIds: { $exists: true } }, { eventsIds: { $exists: true } }, { passesIds: { $exists: true } }] },
               { $set: { ticketsIds: [], eventsIds: [], passesIds: [] } }
          );
          console.log(`Usuarios actualizados: ${updatedUsers.modifiedCount}`);

          await Event.insertMany(eventDate);
          console.log('eventos insertados');

          await mongoose.disconnect();
          console.log("disconect");

     } catch (error) {

          console.log(error);

     }
}




upSeed();