
const User = require('../../api/models/users');
const {verifyToken} = require('../../utils/jwt/jwt')


const isAuth = async (req, res, next) => {
      
     
     try {

          const [, token] = req.headers.authorization.split(" ");

          const { id } = verifyToken(token);

          const user = await User.findById(id);

          req.user = user;
          user.password = null;

          next();

     } catch (error) {

          return res.status(400).json("error");
     }
};

module.exports = { isAuth };