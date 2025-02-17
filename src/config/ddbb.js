const mongoose = require('mongoose');

const conectDDBB = async () => {

     try {

          await mongoose.connect(process.env.DDBB_URL);
          console.log('DDBB conectada 🤖🤖');
         
     } catch (error) {

          console.log('ha sido imposible conectar 🫣');

     }
};

module.exports = { conectDDBB };