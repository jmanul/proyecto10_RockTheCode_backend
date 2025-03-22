
const deleteCloudinaryImage = require('../../utils/cloudinary/deleteCloudinaryImage');

const User = require("../models/users");
const Event = require("../models/events");
const Ticket = require("../models/tickets");

const getEvents = async (req, res, next) => {

     try {

          const events = await Event.find().populate({
               path: 'attendees',
               select: 'userName avatar'
          });

          if (!events) {
               return res.status(404).json({ message: 'eventos no encontrados' });
          }

          return res.status(200).json({ message: 'eventos encontrados', events: events });

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
               return res.status(404).json({ message: 'evento no encontrado' });
          }

          return res.status(200).json(event);

     } catch (error) {

          return res.status(404).json({ error: error.message });

     }
};

const getEventByStatus = async (req, res, next) => {

     try {

          const { eventStatus } = req.params;
          const event = await Event.find({eventStatus}).populate({
               path: 'attendees',
               select: 'userName avatar'
          });

          if (!event) {
               return res.status(404).json({ message: 'evento no encontrado' });
          }

          return res.status(200).json(event);

     } catch (error) {

          return res.status(404).json({ error: error.message });

     }
};


const postEvent = async (req, res, next) => {

     try {
         
          const {name, startDate, ...rest } = req.body;
          let image;
          let createdBy = req.user._id

          const existEvent = await Event.findOne({name, startDate });

          if (existEvent) {
               return res.status(400).json({ message: 'El evento ya existe en la fecha indicada' });
          }

          if (req.file) {

               image = req.file.path;
          }

          const newEvent = await Event.create({
               name,
               startDate,
               image,
               createdBy,
               ...rest
          });

          return res.status(201).json({
               message: 'evento creado correctamente',
               user: newEvent
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

          if (req.body.startDate && new Date(req.body.startDate) <= new Date(event.startDate)) {
               return res.status(400).json({ message: 'la nueva fecha de inicio debe ser posterior a la fecha actual del evento' });
          }

         
          const startDate = req.body.startDate ? new Date(req.body.startDate) : new Date(event.startDate);
          if (req.body.endDate && new Date(req.body.endDate) <= startDate) {
               return res.status(400).json({ message: 'la fecha  de fin debe ser posterior a la fecha de inicio' });
          }

          let eventStatus = event.eventStatus;

          if (req.body.startDate && new Date(req.body.startDate) > new Date(event.startDate)) {eventStatus = 'postponed';
          }

          const updateData = { eventStatus, ...req.body };

          if (req.file) {
               await deleteCloudinaryImage(event.image);
               updateData.image = req.file.path;
          }

          const eventUpdate = await Event.findByIdAndUpdate(eventId, updateData, { new: true });

          return res.status(200).json(eventUpdate);
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
     postEvent,
     putEvent,
     deleteEvent
};


