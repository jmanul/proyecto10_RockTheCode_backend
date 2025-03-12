require('dotenv').config();
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const Event = require('../../api/models/events');
const User = require('../../api/models/users');
const { verifyToken, generateToken, generateCookie} = require('../../utils/jwt/jwt');
const { decrypt } = require('../../utils/crypto/crypto');


const isAuth = async (req, res, next) => {
     try {
         
          let token = req.cookies.accessToken;
       
          if (!token) {

               const refreshToken = req.cookies.refreshToken;

               if (!refreshToken) {
                    return res.status(401).json({ error: 'No hay AccessToken ni RefreshToken',  message: 'inicia sesion o registrate si aún no tienes una cuenta' });
               }

               try {
               
                    const decoded = jwt.decode(refreshToken);

                    const user = await User.findById(decoded.userId).select('+tokenSecret');

                    const decryptedSecret = decrypt(user.tokenSecret, process.env.APP_CRYPTO_KEY);

                    try {

                         req.user = await verifyToken(refreshToken, decryptedSecret, 'refreshToken');

                         token = generateToken( user, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIRATION);

                         generateCookie(res, 'accessToken', token, process.env.ACCESS_TOKEN_COOKIE_EXPIRATION);

                         console.log(`Nuevo accessToken generado:`, token);

                    } catch (verifyError) {

                         return res.status(401).json({ error: 'RefreshToken no valido o expirado' });
                    }


               } catch (refreshError) {
                  
                    return res.status(401).json({ error: 'RefreshToken no valido' });
               }
          }

          req.user = await verifyToken(token, process.env.ACCESS_TOKEN_SECRET, 'accessToken');

          return next();  

     } catch (error) {

          console.log("Error en isAuth:", error);
          return res.status(401).json({message: 'inicia sesion o registrate si aún no tienes una cuenta'});
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