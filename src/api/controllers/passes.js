
const Event = require("../models/events");
const Pass = require("../models/passes");
const User = require("../models/users");


const getPassesByEvent = async (req, res, next) => {

     try {
          const { eventId } = req.params;
          const user = req.user;
          const userId = user?._id;
          const userName = user?.userName;

          const passes = await Pass.find({ eventId }).populate('eventId', 'name location city eventStatus image');

          if (!passes || passes.length === 0) {
               return res.status(404).json({ message: 'entradas no encontradas' });
          }

          // Filtrar passes privados - solo mostrar si el usuario está en la lista de invitados
          const filteredPasses = passes.filter(pass => {
               // Si el pass no es privado, mostrarlo
               if (!pass.isPrivated) return true;
               
               // Si es privado, verificar si el usuario está en la lista de invitados
               const isInGuestList = pass.guestList?.some(guest => 
                    guest.userName === userName || 
                    guest.userId?.toString() === userId?.toString()
               );
               
               // O si es el creador del pass
               const isCreator = pass.createdBy?.toString() === userId?.toString();
               
               return isInGuestList || isCreator;
          });

          // Añadir información de límite de entradas para el usuario actual
          const passesWithUserInfo = filteredPasses.map(pass => {
               const passObj = pass.toObject();
               
               if (pass.isPrivated && pass.guestList) {
                    const guestInfo = pass.guestList.find(guest => 
                         guest.userName === userName || 
                         guest.userId?.toString() === userId?.toString()
                    );
                    
                    if (guestInfo) {
                         passObj.userMaxTickets = guestInfo.maxTickets;
                         passObj.userTicketsObtained = guestInfo.ticketsObtained || 0;
                         passObj.userRemainingTickets = guestInfo.maxTickets - (guestInfo.ticketsObtained || 0);
                    }
               }
               
               return passObj;
          });

          return res.status(200).json(passesWithUserInfo);

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
          let { startDatePass, endDatePass, isPrivated, guestList, ...rest } = req.body;
          const user = req.user;

          if (!eventId) {
               return res.status(400).json({ message: 'el ID del evento es obligatorio para crear un abono' });
          }

          const event = await Event.findById(eventId);
          if (!event) {
               return res.status(404).json({ message: 'evento no encontrado' });
          }

          // Parsear guestList si viene como string JSON (FormData)
          if (typeof guestList === 'string') {
               try {
                    guestList = JSON.parse(guestList);
               } catch (e) {
                    guestList = [];
               }
          }

          // Parsear isPrivated si viene como string
          if (typeof isPrivated === 'string') {
               isPrivated = isPrivated === 'true';
          }

          // Determinar las fechas para el abono la misma del evento si no se especifica otra distinta
          let passStartDate = startDatePass ? new Date(startDatePass) : event.startDate;
          let passEndDate = endDatePass ? new Date(endDatePass) : event.endDate;

          if (passStartDate < event.startDate || passEndDate > event.endDate) {
               return res.status(400).json({
                    message: 'Las fechas del abono deben estar dentro del rango de fechas del evento'
               });
          }

          // Procesar lista de invitados si el pass es privado
          let processedGuestList = [];
          if (isPrivated && guestList && Array.isArray(guestList)) {
               // Validar y buscar usuarios por nombre
               for (const guest of guestList) {
                    const foundUser = await User.findOne({ userName: guest.userName });
                    processedGuestList.push({
                         userName: guest.userName,
                         maxTickets: guest.maxTickets || 1,
                         ticketsObtained: 0,
                         userId: foundUser?._id || null // null si el usuario no existe aún
                    });
               }
          }

          const newPass = await Pass.create({
               eventId,
               startDatePass: passStartDate,
               endDatePass: passEndDate,
               isPrivated: isPrivated || false,
               guestList: processedGuestList,
               createdBy: user._id,
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


// Añadir invitado a la lista de invitados de un pase privado
const addGuestToPass = async (req, res) => {
     try {
          const { passId } = req.params;
          const { userName, maxTickets = 1 } = req.body;

          if (!userName) {
               return res.status(400).json({ message: 'Se requiere el nombre de usuario' });
          }

          const pass = await Pass.findById(passId);
          if (!pass) {
               return res.status(404).json({ message: 'Pase no encontrado' });
          }

          if (!pass.isPrivated) {
               return res.status(400).json({ message: 'Este pase no es privado, no requiere lista de invitados' });
          }

          // Verificar si el usuario ya está en la lista
          const existingGuest = pass.guestList.find(g => g.userName === userName);
          if (existingGuest) {
               return res.status(400).json({ message: 'Este usuario ya está en la lista de invitados' });
          }

          // Buscar el userId
          const user = await User.findOne({ userName });
          if (!user) {
               return res.status(404).json({ message: 'Usuario no encontrado' });
          }

          pass.guestList.push({
               userName,
               userId: user._id,
               maxTickets: maxTickets,
               ticketsPurchased: 0
          });

          await pass.save();

          return res.status(200).json({
               message: 'Invitado añadido correctamente',
               pass
          });

     } catch (error) {
          return res.status(500).json({ error: error.message });
     }
};

// Actualizar datos de un invitado en la lista
const updateGuestInPass = async (req, res) => {
     try {
          const { passId, guestUserId } = req.params;
          const { maxTickets } = req.body;

          const pass = await Pass.findById(passId);
          if (!pass) {
               return res.status(404).json({ message: 'Pase no encontrado' });
          }

          if (!pass.isPrivated) {
               return res.status(400).json({ message: 'Este pase no es privado' });
          }

          const guestIndex = pass.guestList.findIndex(g => g.userId.toString() === guestUserId);
          if (guestIndex === -1) {
               return res.status(404).json({ message: 'Invitado no encontrado en la lista' });
          }

          // No permitir reducir maxTickets por debajo de los ya comprados
          if (maxTickets < pass.guestList[guestIndex].ticketsPurchased) {
               return res.status(400).json({ 
                    message: `No puedes establecer un límite menor a las entradas ya compradas (${pass.guestList[guestIndex].ticketsPurchased})` 
               });
          }

          pass.guestList[guestIndex].maxTickets = maxTickets;
          await pass.save();

          return res.status(200).json({
               message: 'Invitado actualizado correctamente',
               pass
          });

     } catch (error) {
          return res.status(500).json({ error: error.message });
     }
};

// Eliminar invitado de la lista
const removeGuestFromPass = async (req, res) => {
     try {
          const { passId, guestUserId } = req.params;

          const pass = await Pass.findById(passId);
          if (!pass) {
               return res.status(404).json({ message: 'Pase no encontrado' });
          }

          if (!pass.isPrivated) {
               return res.status(400).json({ message: 'Este pase no es privado' });
          }

          const guestIndex = pass.guestList.findIndex(g => g.userId.toString() === guestUserId);
          if (guestIndex === -1) {
               return res.status(404).json({ message: 'Invitado no encontrado en la lista' });
          }

          // No permitir eliminar si ya compró entradas
          if (pass.guestList[guestIndex].ticketsPurchased > 0) {
               return res.status(400).json({ 
                    message: `No puedes eliminar a este invitado, ya ha comprado ${pass.guestList[guestIndex].ticketsPurchased} entrada(s)` 
               });
          }

          pass.guestList.splice(guestIndex, 1);
          await pass.save();

          return res.status(200).json({
               message: 'Invitado eliminado correctamente',
               pass
          });

     } catch (error) {
          return res.status(500).json({ error: error.message });
     }
};

// Obtener lista de invitados de un pase
const getPassGuestList = async (req, res) => {
     try {
          const { passId } = req.params;

          const pass = await Pass.findById(passId)
               .populate('guestList.userId', 'userName email profileImg');
          
          if (!pass) {
               return res.status(404).json({ message: 'Pase no encontrado' });
          }

          if (!pass.isPrivated) {
               return res.status(400).json({ message: 'Este pase no es privado' });
          }

          return res.status(200).json({
               guestList: pass.guestList,
               totalGuests: pass.guestList.length
          });

     } catch (error) {
          return res.status(500).json({ error: error.message });
     }
};

module.exports = {
     getPassesByEvent,
     getPassById,
     postPass,
     putPass,
     deletePass,
     addGuestToPass,
     updateGuestInPass,
     removeGuestFromPass,
     getPassGuestList
};

