
const jwt = require("jsonwebtoken");
const User = require('../../api/models/users');
const { encrypt } = require('../crypto/crypto');
const crypto = require('crypto');


const generateToken = ( user, keySecret, expiration) => {


    return  jwt.sign(
          {
               userId: user._id,
               version: user.tokenVersion
          },
          keySecret, 
          { expiresIn: expiration }
      );
     
     
 
};

const generateCookie = async (res, nameToken, token, timeMaxAge) => {
      
     return res.cookie(nameToken, token, {

          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Strict',
          maxAge: Number(timeMaxAge)
     });
   
}


const verifyToken = async (token, keySecret, tokenName) => { 

     try {
          
          const decoded = jwt.decode(token);

          const user = await User.findById(decoded.userId);

          jwt.verify(token, keySecret);
      
          if (user.tokenVersion !== decoded.version) {
               throw new Error(`el ${tokenName} no es valido`);
          }

          return user;
      
     } catch (error) {
          
          throw new Error(`Fallo en la verificación del ${tokenName}: ${error.message}`);
     }  
    
};


const invalidateUserTokens = async (userId) => {

     const user = await User.findById(userId)
     user.tokenVersion += 1;
     await user.save();
    
};


const rotateUserSecret = async (userId) => {
     const newSecret =  encrypt(crypto.randomBytes(64).toString('hex'), process.env.APP_CRYPTO_KEY);
     await User.findByIdAndUpdate(userId, {
          tokenSecret: newSecret
     });
};

module.exports = {

     generateToken,
     verifyToken,
     generateCookie,
     invalidateUserTokens,
     rotateUserSecret
}; 