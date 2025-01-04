
const rollAuth = (...alloAuthRoles) => {

     return (req, res, next) => {

          const { roll } = req.user;

          if (!alloAuthRoles.includes(roll)) {
               return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
          }

          next();
     };
};

module.exports = { rollAuth };