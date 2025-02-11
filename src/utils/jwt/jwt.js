
const jwt = require("jsonwebtoken");
const User = require('../../api/models/users');
const { decrypt, encrypt } = require('../crypto/crypto');
const crypto = require('crypto');


const generateToken = (user, keySecret, expiration) => {


     return jwt.sign(
          {
               userId: user._id,
               version: user.tokenVersion
          },
          keySecret, 
          { expiresIn: expiration }
     );

 
};


const verifyToken = async (token, keySecret, tokenName) => { 

     try {
          
          const decoded = jwt.decode(token);

          const user = await User.findById(decoded.userId).select('+tokenSecret');

          jwt.verify(token, keySecret);
      
          if (user.tokenVersion !== decoded.version) {
               throw new Error(`el ${tokenName} no es valido`);
          }

          return user;

          
     } catch (error) {
          
          if (error.name === 'TokenExpiredError') {
               console.log(`${tokenName} expirado`);
          } else {
               console.log(`${tokenName} no valido`);
          }
     }

    
};

const refreshAccessToken = async (req, res, next) => {
     try {

          const newAccessToken = generateToken(req.user, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_EXPIRATION);

          res.cookie('accessToken', newAccessToken, {
               httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict', maxAge: 2 * 60 * 60 * 1000
          });

          return res.status(200).json({ message: 'Token actualizado' });

     } catch (error) {
          return res.status(403).json({ error: 'Error al refrescar el token' });
     }
};

const invalidateUserTokens = async (userId) => {

     const user = await User.findById(userId)
     user.tokenVersion += 1;
     await user.save();
    
};


const rotateUserSecret = async (userId) => {
     const newSecret = encrypt(crypto.randomBytes(64).toString('hex'));
     await User.findByIdAndUpdate(userId, {
          tokenSecret: newSecret
     });
};

module.exports = {

     generateToken,
     verifyToken,
     refreshAccessToken,
     invalidateUserTokens,
     rotateUserSecret
}; 