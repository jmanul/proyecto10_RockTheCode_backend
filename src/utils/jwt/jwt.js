
const jwt = require("jsonwebtoken");

const generateToken = (id) => {

     return jwt.sign({ id }, process.env.KEY_SECRET, { expiresIn: '1d' });
}

const verifyToken = (token) => { 

     try {

          return jwt.verify(token, process.env.KEY_SECRET);
          
     } catch (error) {
          
          if (error.name === 'TokenExpiredError') {
               console.log('El token ha expirado.');
          } else {
               console.log('Token no válido.');
          }
     }

    
};

module.exports = {generateToken, verifyToken}; 