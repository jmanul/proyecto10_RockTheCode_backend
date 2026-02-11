
const jwt = require("jsonwebtoken");
const User = require('../../api/models/users');
const { encrypt } = require('../crypto/crypto');
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

const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

const cookieOptions = () => ({
     httpOnly: true,
     secure: isProduction,
     sameSite: isProduction ? 'none' : 'lax',
     path: '/'
});

const generateCookie = async (res, nameToken, token, timeMaxAge) => {

     return res.cookie(nameToken, token, {
          ...cookieOptions(),
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
     const newSecret = encrypt(crypto.randomBytes(64).toString('hex'), process.env.APP_CRYPTO_KEY);
     await User.findByIdAndUpdate(userId, {
          tokenSecret: newSecret
     });
};

const clearAuthCookies = (res) => {
     const opts = cookieOptions();
     delete opts.maxAge;
     res.clearCookie('accessToken', opts);
     res.clearCookie('refreshToken', opts);
};

module.exports = {

     generateToken,
     verifyToken,
     generateCookie,
     invalidateUserTokens,
     rotateUserSecret,
     clearAuthCookies
}; 