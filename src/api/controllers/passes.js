
const Event = require("../models/events");
const Pass = require("../models/passes");
const { eventNames } = require("../models/users");


const getPassesByEvent = async (req, res, next) => {

     try {
          const {eventId} = req.params
          const passes = await Pass.find({ eventId }).populate('eventId', 'name location city eventStatus image');


          if (!eventId) {
               return res.status(404).json({ message: 'evento no encontrado' });
          }

          if (!passes) {
               return res.status(404).json({ message: 'entradas no encontradas' });
          }

          return res.status(200).json(passes);

     } catch (error) {

          return res.status(404).json({ error: error.message });

     }
};


const getPassById = async (req, res, next) => {

     try {

          const { passId } = req.params;
          const pass = await Pass.findById(passId).populate('eventId', 'name location city eventStatus image');

          if (!pass) {
               return res.status(404).json({ message: 'entrada no encontrada' });
          }

          return res.status(200).json(passe);

     } catch (error) {

          return res.status(404).json({ error: error.message });

     }
};



const postPass = async (req, res, next) => {

     try {
          
          const { eventId } = req.params;
          const { startDatePass, endDatePass, ...rest } = req.body;

          if (!eventId) {
               return res.status(400).json({ message: 'el ID del evento es obligatorio para crear un abono' });
          }

          const event = await Event.findById(eventId);
          if (!event) {
               return res.status(404).json({ message: 'evento no encontrado' });
          }

     

           const newPass = await Pass.create({ eventId, startDatePass: event.startDate, endDatePass: event.endDate,  ...rest });

          await Event.findByIdAndUpdate(
               eventId,
               {
                    $addToSet: { passesOfferedIds: newPass._id }
               },
               { new: true }
          );


          const populatedPass = await Pass.findById(newPass._id).populate('eventId', 'name location city eventStatus image');

          return res.status(201).json({
               message: 'entrada creada correctamente',
               pass: populatedPass
          });


     } catch (error) {

          return res.status(404).json({ error: error.message });
     }

};


const putPass = async (req, res, next) => {
     try {
          const { passId } = req.params;
          const { startDatePass, endDatePass, eventId, ...rest } = req.body; 

          const pass = await Pass.findById(passId);

          if (!pass) {
               return res.status(404).json({ message: 'entrada no encontrada' });
          }

          const event = await Event.findById(pass.eventId)

          if (startDatePass || endDatePass) {
               const newStartDate = startDatePass ? new Date(startDatePass) : pass.startDatePass;
               const newEndDate = endDatePass ? new Date(endDatePass) : pass.endDatePass;

               if (newStartDate < event.startDate || newEndDate > event.endDate) {
                    return res.status(400).json({
                         message: 'las fechas deben estar dentro del rango del evento'
                    });
               }

               rest.startDatePass = newStartDate;
               rest.endDatePass = newEndDate;
          }

          const passUpdate = await Pass.findByIdAndUpdate(passId, rest, { new: true });

          return res.status(200).json(passUpdate);
     } catch (error) {

          return res.status(500).json({ error: error.message });
     }
};

const deletePass = async (req, res, next) => {

     try {

          const { passId } = req.params;
          const pass = await Pass.findById(passId)

          if (!pass) {
               return res.status(404).json({ message: 'entrada no encontrada' });
          }

          await Event.findByIdAndUpdate(
               pass.eventId,
               {
                    $pull: { passesOfferedIds: passId }
               },
               { new: true }
          );

          await pass.findByIdAndDelete(passId);

          return res.status(200).json({
               message: 'la entrada fue eliminada',
               pass: pass
          });

     } catch (error) {

          return res.status(404).json({ error: error.message });

     }
};


module.exports = {

     getPassesByEvent,
     getPassById,
     postPass,
     putPass,
     deletePass
};

