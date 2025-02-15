require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const Event = require('../../api/models/events');
const User = require('../../api/models/users');
const { verifyToken, generateToken} = require('../../utils/jwt/jwt');
const { decrypt } = require('../../utils/crypto/crypto');


const isAuth = async (req, res, next) => {
     try {
         
          let token = req.cookies.accessToken;
       
          if (!token) {

               const refreshToken = req.cookies.refreshToken;

               if (!refreshToken) {
                    return res.status(401).json({ error: 'No hay AccessToken ni RefreshToken' });
               }

               try {
               
                    const decoded = jwt.decode(refreshToken);

                    const user = await User.findById(decoded.userId).select('+tokenSecret');

                    const decryptedSecret = decrypt(user.tokenSecret, process.env.APP_CRYPTO_KEY);

                    try {
                         req.user = await verifyToken(refreshToken, decryptedSecret, 'refreshToken');
                    } catch (verifyError) {
                         console.log("Error verificando RefreshToken:", verifyError.message);
                         return res.status(401).json({ error: 'RefreshToken inválido o expirado' });
                    }

                    token = generateToken(user, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIRATION);

                    // guardar el nuevo accessToken en la cookie
                    res.cookie('accessToken', token, {
                         httpOnly: true,
                         secure: process.env.NODE_ENV === 'production',
                         sameSite: 'Strict',
                         maxAge: 15 * 60 * 1000 
                    });

                    console.log("Nuevo accessToken generado:", token);

               } catch (refreshError) {
                    console.log("Error al refrescar el token:", refreshError);
                    return res.status(401).json({ error: 'RefreshToken inválido o expirado' });
               }
          }

          req.user = await verifyToken(token, process.env.ACCESS_TOKEN_SECRET, 'accessToken');

          return next();  

     } catch (error) {

          console.log("Error en isAuth:", error);
          return res.status(401).json({ error: 'Token inválido o expirado' });
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