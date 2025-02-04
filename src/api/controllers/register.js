const User = require("../models/users");

const bcrypt = require('bcrypt');
const { generateToken, invalidateUserTokens, rotateUserSecret } = require("../../utils/jwt/jwt");



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

          res.status(500).json({ message: 'error en el registro', error });
     }


};

const login = async (req, res, next) => {

     try {
          const { userName, password } = req.body;

          const user = await User.findOne({ userName }).select('+password +tokenSecret');//permite consultar password y tokenSecret para compararlo

          if (!user || !(await user.comparePassword(password))) {
               return res.status(401).json({ error: 'usuario o contraseña incorrecta' });
          }

          const token = generateToken(user);

          res.cookie('token', token, {
               httpOnly: true,
               secure: process.env.NODE_ENV === 'production',
               sameSite: 'Strict',
               maxAge: 24 * 60 * 60 * 1000 // 1 día en milisegundos
          });

          return res.status(200).json({
               message: 'autenticación correcta',
               token,
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

          await invalidateUserTokens(req.user._id); 

          res.clearCookie('token')
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

          await rotateUserSecret(userId)

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