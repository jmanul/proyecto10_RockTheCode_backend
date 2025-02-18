require('dotenv').config()



const express = require('express');
const cookieParser = require('cookie-parser');
const { conectDDBB } = require('./src/config/ddbb');
const cloudinary = require('cloudinary').v2;

const registerRouter = require('./src/api/routes/register');
const usersRouter = require('./src/api/routes/users');
const eventsRouter = require('./src/api/routes/events');
const ticketsRouter = require('./src/api/routes/tickets');
const passesRouter = require('./src/api/routes/passes');
const  cleanUpdateOldData = require('./src/utils/cronJobs/cronJobs');


const app = express();

app.use(express.json());
app.use(cookieParser());

conectDDBB();

// verificar eventos caducados

cleanUpdateOldData();

cloudinary.config({

     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
     api_key: process.env.CLOUDINARY_API_KEY,
     api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use('/api/v2/register', registerRouter);
app.use('/api/v2/users', usersRouter);
app.use('/api/v2/events', eventsRouter);
app.use('/api/v2/tickets', ticketsRouter);
app.use('/api/v2/passes', passesRouter);



app.use('*', (req, res, next) => {

     return res.status(200).json('route not found 👽')

});

const PORT = process.env.PORT || 3000;

// Solo iniciar el servidor si no se está en el entorno de Vercel
if (!process.env.VERCEL) {
     
     app.listen(PORT, () => {

          console.log(`listening on port ${PORT} 😎`);

     });
}


module.exports = app;

