const User = require("../models/users");

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { generateToken, rotateUserSecret } = require("../../utils/jwt/jwt");
const { decrypt } = require('../../utils/crypto/crypto');



const register = async (req, res, next) => {

     try {
          const { userName, password } = req.body;

          const existingUser = await User.findOne({ userName });
          if (existingUser) {
               return res.status(400).json({ message: 'el nombre de usuario ya existe' });
          }

          const newUser = new User({
               userName,
               password,
               roll: 'user'
          });

          const savedUser = await newUser.save();

          res.status(201).json({ message: 'usuario registrado exitosamente', user: savedUser });

     } catch (error) {

          res.status(500).json({ message: 'error en el registro', error: error.message });
     }


};

const login = async (req, res, next) => {

     try {
          const { userName, password } = req.body;

          const user = await User.findOne({ userName }).select('+password +tokenSecret');//permite consultar password y tokenSecret para compararlo

          const decryptedSecret = decrypt(user.tokenSecret, process.env.APP_CRYPTO_KEY);

          if (!user || !(await user.comparePassword(password))) {
               return res.status(401).json({ error: 'usuario o contraseña incorrecta' });
          }
          

          const acessToken = generateToken(user, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIRATION);

          const refreshToken = generateToken(user, decryptedSecret, process.env.REFRESH_TOKEN_EXPIRATION);

          res.cookie('acessToken', acessToken, {
               httpOnly: true,
               secure: process.env.NODE_ENV === 'production',
               sameSite:'Strict',
               maxAge: 24 * 60 * 60 * 1000 // 1 día en milisegundos
          });

          res.cookie('refreshToken', refreshToken, {
               httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict', maxAge: 7 * 24 * 60 * 60 * 1000
          });

          return res.status(200).json({
               message: 'autenticación correcta',
               acessToken,
               user: {
                    _id: user._id,
                    userName: user.userName,
                    roll: user.roll,
                    eventsIds: user.eventsIds,
                    passesIds: user.passesIds,
                    ticketsIds: user.ticketsIds
               }
          })

     } catch (error) {
          return res.status(500).json({ message: 'error en la autenticación', error: error.message });


     }


};


const logout = async (req, res, next) => {
     
     try {

          const user = await User.findById(req.user.userId);
          if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

          user.tokenVersion += 1; // Incrementar la versión del token para invalidar los existentes
          await user.save();

          res.clearCookie('accessToken');
          res.clearCookie('refreshToken');
         
          return res.status(200).json({ message: 'sesión cerrada' });
          
     } catch (error) {
          
          res.status(500).json({ message: 'no se pudo cerrar sesión' });
     }
}


const changePassword = async (req, res, next) => {

     try {

          

          const { oldPassword, newPassword } = req.body;
          const userId = req.user._id;

          const user = await User.findById(userId).select('+password +tokenSecret');

          if (!user || !(await user.comparePassword(oldPassword))) {
               return res.status(401).json({ message: 'contraseña incorrecta' });
          }

          user.password = newPassword;
          await user.save();

          await rotateUserSecret(userId);

          return res.status(200).json({ message: 'contraseña cambiada exitosamente' });

     } catch (error) {

          return res.status(404).json({ message: 'error al cambiar la contraseña', error: error.message });
     }
}


module.exports = {

     register,
     login,
     logout,
     changePassword
};