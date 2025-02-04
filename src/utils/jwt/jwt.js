
const jwt = require("jsonwebtoken");
const User = require('../../api/models/users');
const {decrypt, encrypt} = require('../crypto/crypto');


const generateToken = (user) => {

     const decryptedSecret = decrypt(user.tokenSecret);

     return jwt.sign(
          {
               userId: user._id,
               version: user.tokenVersion
          },
          decryptedSecret, 
          { expiresIn: '1d' }
     );
};


const verifyToken = async (token) => { 

     try {
          
          const decoded = jwt.decode(token);

          const user = await User.findById(decoded.userId).select('+tokenSecret');

          if (!user) {
               throw new Error('usuario no encontrado');
          }

          const decryptedSecret = decrypt(user.tokenSecret);

          jwt.verify(token, decryptedSecret);
      
          if (user.tokenVersion !== decoded.version) {
               throw new Error('el token no es valido');
          }

          return user;

          
     } catch (error) {
          
          if (error.name === 'TokenExpiredError') {
               console.log('token expirado');
          } else {
               console.log('token no valido');
          }
     }

    
};

const invalidateUserTokens = async (userId) => {
     await User.findByIdAndUpdate(userId, {
          $inc: { tokenVersion: 1 }
     });
};


const rotateUserSecret = async (userId) => {
     const newSecret = encrypt(crypto.randomBytes(64).toString('hex'));
     await User.findByIdAndUpdate(userId, {
          tokenSecret: newSecret,
          $inc: { tokenVersion: 1 }
     });
};

module.exports = {

     generateToken,
     verifyToken,
     invalidateUserTokens,
     rotateUserSecret
}; 