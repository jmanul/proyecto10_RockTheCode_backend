
const deleteCloudinaryImage = require('../../utils/cloudinary/deleteCloudinaryImage');

const User = require("../models/users");
const Event = require("../models/events");

const getEvents = async (req, res, next) => {

     try {

          const events = await Event.find().populate({
               path: 'attendees',
               select: 'userName avatar'
          });

          if (!events) {
               return res.status(404).json({ message: 'eventos no encontrados' });
          }

          return res.status(200).json(events);

     } catch (error) {

          return res.status(404).json({ error: error.message });

     }
};


const getEventById = async (req, res, next) => {

     try {

          const { id } = req.params;
          const event = await Event.findById(id).populate({
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

const getEventByName = async (req, res, next) => {

     try {

          const { name } = req.params;
          const event = await Event.find({name}).populate({
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

          const { name, startDate, attendees, ...rest } = req.body;
          let image;
          let createdBy = req.user._id

          const existEvent = await Event.findOne({ name, startDate });

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

          const { id } = req.params;
          const event = await Event.findById(id);

          if (!event) {
               return res.status(404).json({ message: 'Evento no encontrado' });
          }

          if (req.file) {

               await deleteCloudinaryImage(event.image);

               req.body.image = req.file.path;
          }

          const eventUpdate = await Event.findByIdAndUpdate(id, req.body, { new: true });
          

          return res.status(200).json(eventUpdate);


     } catch (error) {

          if (req.file) {
               await deleteCloudinaryImage(req.file.path);
          }

          return res.status(404).json({ error: error.message });
     }
};

const deleteEvent = async (req, res, next) => {

     try {

          const { id } = req.params;
          const event = await Event.findById(id)

          if (!event) {
               return res.status(404).json({ message: 'evento no encontrado' });
          }

          await deleteCloudinaryImage(event.image);
          
          await Event.findByIdAndDelete(id);

          await User.updateMany({ eventsIds: id }, { $pull: { eventsIds: id } });

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
     getEventByName,
     postEvent,
     putEvent,
     deleteEvent
};


