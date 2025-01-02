const User = require("../models/users");

const bcrypt = require('bcrypt');
 const { generateToken } = require("../../utils/jwt/jwt");



const register = async (req, res, next) => {

     try {
          const { userName, password } = req.body;

          const existingUser = await User.findOne({ userName });
          if (existingUser) {
               return res.status(400).json({ message: 'El nombre de usuario ya existe' });
          }

          const newUser = new User({
               userName,
               password,
               roll: 'user'
          });


          const savedUser = await newUser.save();

          res.status(201).json({ message: 'Usuario registrado exitosamente', user: savedUser });

     } catch (error) {

          res.status(500).json({ message: 'Error en el registro', error });
     }


};

const login = async (req, res, next) => {

     try {
          const { userName, password } = req.body;

          const user = await User.findOne({ userName })

          if (!user) {
               return res.status(400).json({ message: 'Usuario o contraseña incorrecta' });
          }
         

          const isMatch = await bcrypt.compare(password.trim(), user.password.trim());

          if (!isMatch) {
               return res.status(400).json({ message: 'Usuario o contraseña incorrecta' });
          }


          const { _id, ...userRest } = user

          const token = generateToken(user._id);


          return res.status(200).json({
               message: 'Autenticación correcta',
               token,
               user: {
                    _id: user._id,
                    userName: user.userName,
                    roll: user.roll,
                    events: user.events
               }
          })

     } catch (error) {
          return res.status(500).json({ message: 'Error en la autenticación', error });


     }


};


module.exports = {

     register,
     login,
};