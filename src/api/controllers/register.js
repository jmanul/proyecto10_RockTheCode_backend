require('dotenv').config();

const User = require("../models/users");
const { generateToken, rotateUserSecret, generateCookie, clearAuthCookies } = require("../../utils/jwt/jwt");
const { decrypt } = require('../../utils/crypto/crypto');



const register = async (req, res, next) => {

     try {
          const { userName, password, email} = req.body;

          const existingUser = await User.findOne({
               $or: [
                    { userName: userName },
                    { email: email }       
               ]
          });
          if (existingUser) {
               return res.status(400).json({ message: 'el nombre de usuario o la direccion de correo electronico ya existe' });
          }

          const newUser = new User({
               userName,
               password,
               email,
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

          const accessToken = generateToken(user, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIRATION);

          await generateCookie(res, 'accessToken', accessToken, process.env.ACCESS_TOKEN_COOKIE_EXPIRATION);

          const refreshToken = generateToken(user, decryptedSecret, process.env.REFRESH_TOKEN_EXPIRATION);

          await generateCookie(res, 'refreshToken', refreshToken, process.env.REFRESH_TOKEN_COOKIE_EXPIRATION);

          return res.status(200).json({
               message: `Bienvenido ${user.userName}`,
               accessToken,
               user: {
                    _id: user._id,
                    userName: user.userName,
                    roll: user.roll,
                    avatar: user.avatar,
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

          const user = await User.findById(req.user._id);

          if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

          user.tokenVersion += 1; // Incrementar la versión del token para invalidar los existentes
          await user.save();

          clearAuthCookies(res);

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


          clearAuthCookies(res);

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