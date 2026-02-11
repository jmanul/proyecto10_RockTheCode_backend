
const deleteCloudinaryImage = require('../../utils/cloudinary/deleteCloudinaryImage');

const User = require("../models/users");
const Event = require("../models/events");
const Ticket = require("../models/tickets");
const { buildFullAddress } = require('../../services/buildFullAddress');
const { findCountryByName } = require('../../data/countries');
const { toBoolean } = require('../../utils/toBoolean');
const { paginate } = require('../../utils/pagination/paginate');

const getEvents = async (req, res, next) => {

     try {
          const user = req.user;
          const { page = 1, limit = 10 } = req.query;

          // Construir query para filtrar eventos privados
          // Los usuarios solo ven: eventos públicos + eventos privados donde son creadores o asistentes
          const userId = user?._id;
          
          const query = {
               $or: [
                    { isPrivated: false }, // Eventos públicos
                    { isPrivated: { $exists: false } }, // Eventos sin campo isPrivated (compatibilidad)
                    { createdBy: userId }, // Eventos privados creados por el usuario
                    { attendees: userId } // Eventos privados donde el usuario está inscrito
               ]
          };

          const { data: events, pagination } = await paginate({
               model: Event,
               query,
               populate: {
                    path: 'attendees',
                    select: 'userName avatar'
               },
               sort: { startDate: -1 }, // Ordenar por fecha de inicio (más nuevos primero)
               page: parseInt(page),
               limit: parseInt(limit)
          });

          if (!events || events.length <= 0) {
               return res.status(200).json({ message: 'eventos no encontrados', pagination });
          }

          return res.status(200).json({ 
               message: 'eventos encontrados', 
               events, 
               user, 
               pagination 
          });

     } catch (error) {

          return res.status(404).json({ error: error.message });

     }
};


const getEventByUser = async (req, res, next) => {

     
     try {
         
          const userId = req.user._id;
          const createdBy = userId
         
          const events = await Event.find({ createdBy }).populate({
               path: 'attendees',
               select: 'userName avatar'
          });

          if (!events || events.length <= 0) {
               return res.status(200).json({ message: 'No hay eventos' });
          }
          console.log(events);
          return res.status(200).json({ message: 'eventos encontrados', events: events});

     } catch (error) {

          return res.status(404).json({ error: error.message });

     }
};


const getEventById = async (req, res, next) => {

     try {

          const { eventId } = req.params;
          const { inviteCode } = req.query; // Código de invitación opcional
          const user = req.user;
          const userId = user?._id;

          const event = await Event.findById(eventId).populate({
               path: 'attendees',
               select: 'userName avatar'
          });

          if (!event) {
               return res.status(404).json({ message: 'evento no encontrado'});
          }

          // Verificar acceso a eventos privados
          if (event.isPrivated) {
               const isCreator = event.createdBy?.toString() === userId?.toString();
               const isAttendee = event.attendees?.some(att => att._id?.toString() === userId?.toString());
               
               // Si no es creador ni asistente, verificar código de invitación
               if (!isCreator && !isAttendee) {
                    if (!inviteCode) {
                         return res.status(403).json({ 
                              message: 'Este es un evento privado. Necesitas un código de invitación.',
                              isPrivate: true
                         });
                    }

                    // Verificar código de invitación
                    const invitation = event.invitations?.find(inv => 
                         inv.code === inviteCode && 
                         inv.isActive &&
                         inv.usedCount < inv.maxUses &&
                         (!inv.expiresAt || new Date(inv.expiresAt) > new Date())
                    );

                    if (!invitation) {
                         return res.status(403).json({ 
                              message: 'El código de invitación no es válido, ha expirado o ha alcanzado su límite de usos.',
                              isPrivate: true
                         });
                    }

                    // El código es válido, devolver evento con flag de invitación válida
                    return res.status(200).json({ 
                         message: 'eventos encontrados', 
                         events: event,
                         validInvitation: true,
                         inviteCode
                    });
               }
          }

          return res.status(200).json({ message: 'eventos encontrados', events: event });

     } catch (error) {

          return res.status(404).json({ error: error.message });

     }
};

const getEventByStatus = async (req, res, next) => {

     try {

          const { eventStatus } = req.params;
          const events = await Event.find({eventStatus}).populate({
               path: 'attendees',
               select: 'userName avatar'
          });

          if (!events) {
               return res.status(404).json({ message: 'eventos no encontrados' });
          }

          return res.status(200).json({ message: 'eventos encontrados', events });

     } catch (error) {

          return res.status(404).json({ error: error.message });

     }
};

const getEventByType = async (req, res, next) => {

     try {
          const user = req.user
          const { slug } = req.params;

          
          const events = await Event.find({ slug }).populate({
               path: 'attendees',
               select: 'userName avatar'
          });

          if (!events) {
               return res.status(404).json({ message: 'eventos no encontrados' });
          }

          return res.status(200).json({ message: 'eventos encontrados', events, user });

     } catch (error) {

          return res.status(404).json({ error: error.message });

     }
};


const postEvent = async (req, res, next) => {

     try {
         
          const {name, startDate, address, location,city, postalCode,country, ...rest } = req.body;
          let image;
          let createdBy = req.user._id

          const existEvent = await Event.findOne({name, startDate });

          if (existEvent) {
               return res.status(400).json({ message: 'El evento ya existe en la fecha indicada' });
          }

          if (req.file) {

               image = req.file.path;
          }

          let countryObj = { name: "España", code: "ES" }; 

          if (country) {
               const found = findCountryByName(country);
               if (found) countryObj = found;
          }

          // Construimos la dirección completa con los datos recibidos
          const mergedData = {
               address,
               location,
               city,
               postalCode,
               country: countryObj
          };

          const fullAddress = buildFullAddress(mergedData);

          const newEvent = await Event.create({
               name,
               startDate,
               image,
               createdBy,
               ...mergedData,
               fullAddress,
               ...rest
          });

          return res.status(201).json({
               message: 'evento creado correctamente',
               event: newEvent
          });


     } catch (error) {

          if (req.file) {
               await deleteCloudinaryImage(req.file.path); 
          }

          return res.status(404).json({ error: error.message });
     }

};


const putEvent = async (req, res, next) => {
     try {
          const { eventId } = req.params;
          const event = await Event.findById(eventId);

          if (!event) {
               return res.status(404).json({ message: 'Evento no encontrado' });
          } 
         
          const startDate = req.body.startDate ? new Date(req.body.startDate) : new Date(event.startDate);
          if (req.body.endDate && new Date(req.body.endDate) <= startDate) {
               return res.status(400).json({ message: 'la fecha  de fin debe ser posterior a la fecha de inicio' });
          }

          let eventStatus = event.eventStatus;

          if (req.body.startDate && new Date(req.body.startDate) > new Date(event.startDate)) {eventStatus = 'postponed';
          }

          let updateData = { eventStatus, ...req.body };

          // Si el checkbox vino en el body (marcado o desmarcado explícitamente)

          if ('isPrivated' in req.body) {
               updateData.isPrivated = toBoolean(req.body.isPrivated);
          }

          console.log(updateData.isPrivated);

          const data = req.body;


          let fullAddress = event.fullAddress;
          let countryName = data.country;

          // Si el usuario ha enviado un país, creamos el objeto country

          if (countryName) {
               let countryObj = findCountryByName(countryName);
               if (!countryObj) {
                    return res.status(400).json({ error: `País no válido: ${countryName}` });
               }

               countryName = countryObj;
          }

         

          // Combinamos datos previos y nuevos
          const mergedData = {
               address: data.address ?? event.address,
               location: data.location ?? event.location,
               city: data.city ?? event.city,
               postalCode: data.postalCode ?? event.postalCode,
               country: countryName ?? event.country
          };

          updateData.country = countryName

          // Construimos el fullAddress actualizado

          let newFullAddress =  buildFullAddress(mergedData);
          

          // Añadimos el fullAddress  si ha habido algun cambio

          if (newFullAddress !== fullAddress) {

               updateData.fullAddress = newFullAddress;
          };

          if (req.file) {
               await deleteCloudinaryImage(event.image);
               updateData.image = req.file.path;
          }

          const eventUpdate = await Event.findByIdAndUpdate(eventId, updateData, {
               new: true
});

          return res.status(200).json({
               message: 'evento actualizado correctamente',
               event: eventUpdate
          });
     } catch (error) {
          if (req.file) {
               await deleteCloudinaryImage(req.file.path);
          }

          return res.status(500).json({ error: error.message });
     }
};

const deleteEvent = async (req, res, next) => {

     try {

          const { eventId } = req.params;
          const event = await Event.findById(eventId)
          

          if (!event) {
               return res.status(404).json({ message: 'evento no encontrado' });
          }

          await deleteCloudinaryImage(event.image);

          await Ticket.updateMany({ eventId: eventId }, { $set: { eventStatus: 'cancelled' } });
          
          await Event.findByIdAndDelete(eventId);

          await User.updateMany({ eventsIds: eventId }, { $pull: { eventsIds: eventId } });

          return res.status(200).json({
               message: 'El evento fue eliminado',
               user: event
          });

     } catch (error) {

          return res.status(404).json({ error: error.message });

     }
};

/**
 * Genera un código de invitación para un evento privado
 * Solo el creador del evento puede generar códigos
 */
const createInvitation = async (req, res, next) => {
     try {
          const { eventId } = req.params;
          const { maxUses = 1, expiresInDays } = req.body;
          const user = req.user;

          const event = await Event.findById(eventId);

          if (!event) {
               return res.status(404).json({ message: 'Evento no encontrado' });
          }

          // Solo el creador puede generar invitaciones
          if (event.createdBy?.toString() !== user._id?.toString()) {
               return res.status(403).json({ message: 'Solo el creador del evento puede generar invitaciones' });
          }

          // Verificar que el evento sea privado
          if (!event.isPrivated) {
               return res.status(400).json({ message: 'Solo los eventos privados necesitan códigos de invitación' });
          }

          // Generar código único
          const code = require('crypto').randomBytes(8).toString('hex');

          // Crear invitación
          const invitation = {
               code,
               maxUses: Math.max(1, Math.min(100, parseInt(maxUses) || 1)), // Entre 1 y 100
               usedCount: 0,
               usedBy: [],
               createdAt: new Date(),
               isActive: true
          };

          // Añadir fecha de expiración si se especifica
          if (expiresInDays && expiresInDays > 0) {
               const expiresAt = new Date();
               expiresAt.setDate(expiresAt.getDate() + parseInt(expiresInDays));
               invitation.expiresAt = expiresAt;
          }

          // Añadir invitación al evento
          event.invitations = event.invitations || [];
          event.invitations.push(invitation);
          await event.save();

          return res.status(201).json({
               message: 'Código de invitación creado',
               invitation: {
                    code: invitation.code,
                    maxUses: invitation.maxUses,
                    expiresAt: invitation.expiresAt,
                    inviteUrl: `${process.env.FRONTEND_URL}/events/${eventId}?inviteCode=${code}`
               }
          });

     } catch (error) {
          return res.status(500).json({ error: error.message });
     }
};

/**
 * Usa un código de invitación para inscribirse en un evento privado
 */
const useInvitation = async (req, res, next) => {
     try {
          const { eventId } = req.params;
          const { inviteCode } = req.body;
          const user = req.user;
          const userId = user._id;

          const event = await Event.findById(eventId);

          if (!event) {
               return res.status(404).json({ message: 'Evento no encontrado' });
          }

          if (!event.isPrivated) {
               return res.status(400).json({ message: 'Este evento no requiere invitación' });
          }

          // Verificar si ya está inscrito
          if (event.attendees?.some(att => att.toString() === userId.toString())) {
               return res.status(400).json({ message: 'Ya estás inscrito en este evento' });
          }

          // Buscar y validar el código de invitación
          const invitationIndex = event.invitations?.findIndex(inv =>
               inv.code === inviteCode &&
               inv.isActive &&
               inv.usedCount < inv.maxUses &&
               (!inv.expiresAt || new Date(inv.expiresAt) > new Date())
          );

          if (invitationIndex === -1 || invitationIndex === undefined) {
               return res.status(403).json({
                    message: 'El código de invitación no es válido, ha expirado o ha alcanzado su límite de usos.'
               });
          }

          // Verificar si el usuario ya usó este código
          if (event.invitations[invitationIndex].usedBy?.some(u => u.toString() === userId.toString())) {
               return res.status(400).json({ message: 'Ya has usado este código de invitación' });
          }

          // Actualizar invitación
          event.invitations[invitationIndex].usedCount++;
          event.invitations[invitationIndex].usedBy.push(userId);

          // Desactivar si alcanzó el límite
          if (event.invitations[invitationIndex].usedCount >= event.invitations[invitationIndex].maxUses) {
               event.invitations[invitationIndex].isActive = false;
          }

          // Añadir usuario a asistentes
          event.attendees.push(userId);
          await event.save();

          // Añadir evento al usuario
          await User.findByIdAndUpdate(userId, { $push: { eventsIds: eventId } });

          return res.status(200).json({
               message: 'Te has inscrito correctamente al evento',
               event: {
                    _id: event._id,
                    name: event.name
               }
          });

     } catch (error) {
          return res.status(500).json({ error: error.message });
     }
};

/**
 * Obtiene las invitaciones de un evento (solo para el creador)
 */
const getInvitations = async (req, res, next) => {
     try {
          const { eventId } = req.params;
          const user = req.user;

          const event = await Event.findById(eventId).populate({
               path: 'invitations.usedBy',
               select: 'userName avatar'
          });

          if (!event) {
               return res.status(404).json({ message: 'Evento no encontrado' });
          }

          // Solo el creador puede ver las invitaciones
          if (event.createdBy?.toString() !== user._id?.toString()) {
               return res.status(403).json({ message: 'Solo el creador del evento puede ver las invitaciones' });
          }

          return res.status(200).json({
               message: 'Invitaciones encontradas',
               invitations: event.invitations || []
          });

     } catch (error) {
          return res.status(500).json({ error: error.message });
     }
};

module.exports = {

     getEvents,
     getEventById,
     getEventByStatus,
     getEventByType,
     postEvent,
     putEvent,
     deleteEvent,
     getEventByUser,
     createInvitation,
     useInvitation,
     getInvitations
};