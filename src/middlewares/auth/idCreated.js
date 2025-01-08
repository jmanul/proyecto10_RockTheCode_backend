const Event = require('../../api/models/events');

const idCreated = async (req, res, next) => {
     
     try {
          const { roll, _id } = req.user;
          const { id } = req.params;

          const event = await Event.findById(id);
          if (!event) {
               return res.status(404).json({ message: 'Evento no encontrado' });
          }


          if (roll === 'administrator') {
               return next();
          }


          if (_id.toString() === event.createdBy.toString() ) {
               return next();
          }


          return res.status(403).json({ message: 'Acceso denegado' });

     } catch (error) {

          return res.status(500).json({ message: 'Error en la autorización', error: error.message });
     }
};


module.exports = { idCreated };