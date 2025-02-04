const mongoose = require('mongoose');
const Event = require('../../api/models/events');
const User = require('../../api/models/users');
const { verifyToken } = require('../../utils/jwt/jwt')


const isAuth = async (req, res, next) => {


     try {

          const token = req.cookies.token;

          req.user = verifyToken(token);

          next();

     } catch (error) {

          let message = 'error de autenticación';
          if (error.name === 'TokenExpiredError') {
               message = 'sesión caducada';
          } else if (error.name === 'JsonWebTokenError') {
               message = 'token no válido';
          }

          return res.status(401).clearCookie('token').json({ error: error.message });
     }
};

const rollAuth = (...alloAuthRoles) => {

     return (req, res, next) => {

          const { roll } = req.user;

          if (!alloAuthRoles.includes(roll)) {
               return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
          }

          next();
     };
};

const idCreated = async (req, res, next) => {

     try {
          const { roll, _id } = req.user;
          const { eventId } = req.params;
          
          if (!mongoose.Types.ObjectId.isValid(eventId)) {
               return res.status(400).json({ message: 'el Id no es valido', _id });
               
          }

          const event = await Event.findById(eventId);
          if (!event) {
               return res.status(404).json({ message: 'Evento no encontrado' });
          }


          if (roll === 'administrator') {
               return next();
          }


          if (_id.toString() === event.createdBy.toString()) {
               return next();
          }


          return res.status(403).json({ message: 'Acceso denegado' });

     } catch (error) {

          return res.status(500).json({ message: 'Error en la autorización', error: error.message });
     }
};

const idAuth = (req, res, next) => {
     try {
          const { roll, _id } = req.user;
          const { userId } = req.params;
          
          if (roll === 'administrator') {
               return next();
          }

          if (_id.toString() === userId) {
               return next(); 
               
          }

          return res.status(403).json({ message: 'Acceso denegado' });

     } catch (error) {

          return res.status(500).json({ message: 'Error en la autorización', error });
     }
};


module.exports = { idAuth, rollAuth, idCreated, isAuth };