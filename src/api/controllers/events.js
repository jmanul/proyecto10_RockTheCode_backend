
const deleteCloudinaryImage = require('../../utils/cloudinary/deleteCloudinaryImage');

const User = require("../models/users");
const Event = require("../models/events");

const getEvents = async (req, res, next) => {

     try {

          const events = await Event.find().populate({
               path: 'users',
               select: 'userName avatar'
          });

          if (!events) {
               return res.status(404).json({ message: 'eventos no encontrados' });
          }

          return res.status(200).json(events);

     } catch (error) {

          return res.status(404).json(error);

     }
};


const getEventById = async (req, res, next) => {

     try {

          const { id } = req.params;
          const event = await Event.findById(id).populate({
               path: 'users',
               select: 'userName avatar'
          });

          if (!event) {
               return res.status(404).json({ message: 'evento no encontrado' });
          }

          return res.status(200).json(event);

     } catch (error) {

          return res.status(404).json(error);

     }
};

const getEventByName = async (req, res, next) => {

     try {

          const { userName } = req.params;
          const event = await Event.findById(userName).populate({
               path: 'users',
               select: 'userName avatar'
          });

          if (!event) {
               return res.status(404).json({ message: 'evento no encontrado' });
          }

          return res.status(200).json(event);

     } catch (error) {

          return res.status(404).json(error);

     }
};


const postEvent = async (req, res, next) => {

     try {

          const { name, startDate, createdBy, ...rest } = req.body;
          let image;
          createdBy = req.user._id

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

          return res.status(404).json(error);
     }

};


const putEvent = async (req, res, next) => {

     try {

          const { id } = req.params;
          const event = await Event.findById(id);

          if (!event) {
               return res.status(404).json({ message: 'Evento no encontrado' });
          }

          if (event.createdBy.toString() !== req.user._id) {
               return res.status(403).json({ message: 'No tienes permiso para modificar este evento' });
          }

          if (req.file) {

               await deleteCloudinaryImage(event.image);

               event.image = req.file.path;
          }

          const eventUpdate = await Event.findByIdAndUpdate(id, req.body, { new: true });


          return res.status(200).json(eventUpdate);


     } catch (error) {

          return res.status(404).json(error);
     }
};

const deleteEvent = async (req, res, next) => {

     try {

          const { id } = req.params;
          const event = Event.findById(id)

          if (!event) {
               return res.status(404).json({ message: 'evento no encontrado' });
          }

          await deleteCloudinaryImage(event.image);
          
          await Event.findByIdAndDelete(id);

          await User.updateMany({ events: id }, { $pull: { events: id } });

          return res.status(200).json({
               message: 'El evento fue eliminado',
               user: event
          });

     } catch (error) {

          return res.status(404).json(error);

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