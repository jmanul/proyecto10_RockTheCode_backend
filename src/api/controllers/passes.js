
const Event = require("../models/events");
const Pass = require("../models/passes");


const getPassesByEvent = async (req, res, next) => {

     try {
          const {eventId} = req.params
          const passes = await Pass.find({ eventId }).populate('eventId', 'name location city eventStatus image');

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

          return res.status(200).json(pass);

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

          // Determinar las fechas para el abono la misma del evento si no se especifica otra distinta
          let passStartDate = startDatePass ? new Date(startDatePass) : event.startDate;
          let passEndDate = endDatePass ? new Date(endDatePass) : event.endDate;

          if (passStartDate < event.startDate || passEndDate > event.endDate) {
               return res.status(400).json({
                    message: 'Las fechas del abono deben estar dentro del rango de fechas del evento'
               });
          }

          const newPass = await Pass.create({
               eventId,
               startDatePass: passStartDate,
               endDatePass: passEndDate,
               ...rest
          });

          await Event.findByIdAndUpdate(
               eventId,
               {
                    $addToSet: { passesOfferedIds: newPass._id },
                    $inc: { maxCapacity: newPass.maxCapacityPass },
                    $set: {soldOut: false}
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
          const { startDatePass, endDatePass, maxCapacityPass, ...rest } = req.body;

          const pass = await Pass.findById(passId);
          if (!pass) {
               return res.status(404).json({ message: 'Entrada no encontrada' });
          }

          const oldMaxCapacityPass = pass.maxCapacityPass;
          const event = await Event.findById(pass.eventId);

          // Validar fechas si fueron modificadas
          if (startDatePass || endDatePass) {
               const newStartDate = startDatePass ? new Date(startDatePass) : pass.startDatePass;
               const newEndDate = endDatePass ? new Date(endDatePass) : pass.endDatePass;

               if (newStartDate < event.startDate || newEndDate > event.endDate) {
                    return res.status(400).json({
                         message: 'Las fechas deben estar dentro del rango del evento'
                    });
               }

               rest.startDatePass = newStartDate;
               rest.endDatePass = newEndDate;
          }

          // Validar nueva capacidad
          if (
               maxCapacityPass !== undefined &&
               maxCapacityPass < pass.totalReservedPlacesPass
          ) {
               return res.status(400).json({
                    message: `No puedes reducir el aforo por debajo de las plazas ya reservadas (${pass.totalReservedPlacesPass})`
               });
          }

          if (maxCapacityPass !== undefined) {
               rest.maxCapacityPass = maxCapacityPass;
          }

          const passUpdate = await Pass.findByIdAndUpdate(passId, rest, { new: true });

          // Actualizar aforo del evento si cambió la capacidad
          if (
               maxCapacityPass !== undefined &&
               maxCapacityPass !== oldMaxCapacityPass
          ) {
               await Event.findByIdAndUpdate(
                    pass.eventId,
                    {
                         $inc: {
                              maxCapacity: passUpdate.maxCapacityPass - oldMaxCapacityPass
                         }
                    },
                    { new: true }
               );
          }

          return res.status(200).json({
               message: 'Entrada actualizada correctamente',
               pass: passUpdate
          });

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

          // Validar si se han vendido entradas
          if (pass.totalReservedPlacesPass > 0) {

               return res.status(400).json({
                    message: `No puedes eliminar este abono ya se han reservado ${pass.totalReservedPlacesPass} plazas.`
               });
          }

          await Event.findByIdAndUpdate(
               pass.eventId,
               {
                    $pull: { passesOfferedIds: passId },
                    $inc: {
                         maxCapacity: -pass.maxCapacityPass
                    }
               },
               { new: true }
          );

          await Pass.findByIdAndDelete(passId);

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

