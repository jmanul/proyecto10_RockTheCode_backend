
const { countries } = require('../../data/countries');

const getCountries = async (req, res, next) => {

     try {

          return res.status(200).json(countries);

     } catch (error) {

          return res.status(404).json({ error: error.message });

     }
};



module.exports = {

     getCountries
};
