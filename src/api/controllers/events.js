
const deleteCloudinaryImage = require('../../utils/cloudinary/deleteCloudinaryImage');

const User = require("../models/users");
const Event = require("../models/events");
const Ticket = require("../models/tickets");
const { buildFullAddress } = require('../../services/buildFullAddress');
const { findCountryByName } = require('../../data/countries');
const { toBoolean } = require('../../utils/toBoolean');

const getEvents = async (req, res, next) => {

     try {
          const user = req.user
          const events = await Event.find().populate({
               path: 'attendees',
               select: 'userName avatar'
          });

         

          if (!events || events.length <= 0) {
               return res.status(200).json({ message: 'eventos no encontrados' });
          }

          return res.status(200).json({ message: 'eventos encontrados', events: events, user: user });

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
          const event = await Event.findById(eventId).populate({
               path: 'attendees',
               select: 'userName avatar'
          });

          if (!event) {
               return res.status(404).json({ message: 'evento no encontrado'});
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

module.exports = {

     getEvents,
     getEventById,
     getEventByStatus,
     getEventByType,
     postEvent,
     putEvent,
     deleteEvent,
     getEventByUser
};


