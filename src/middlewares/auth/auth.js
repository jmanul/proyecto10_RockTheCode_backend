require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const mongoose = require('mongoose');
const Event = require('../../api/models/events');
const User = require('../../api/models/users');
const { verifyToken, refreshAccessToken } = require('../../utils/jwt/jwt')


const isAuth = async (req, res, next) => {


     try {

          const token = req.cookies.acessToken;

          if (!token) {
               return res.status(401).json({ error: ' token no proporcionado' });
          }
          
          req.user = await verifyToken(token, process.env.ACCES_TOKEN_SECRET, 'accesToken');
        

          next();
               
          


     } catch (error) {

          if (error.name === 'TokenExpiredError') {
               
               const token = req.cookies.refreshToken;
               const decoded = jwt.decode(token);

               const user = await User.findById(decoded.userId).select('+tokenSecret');
               req.user = await verifyToken(token, user.tokenSecret, 'refreshToken');

               return refreshAccessToken(req, res, next); // Intentar refrescar token
          }
          return res.status(401).json({ error: 'Token inválido o expirado' });
     };
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