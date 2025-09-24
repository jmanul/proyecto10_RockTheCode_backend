require('dotenv').config()

const express = require('express');
const cookieParser = require('cookie-parser');
const { conectDDBB } = require('./src/config/ddbb');
//const { corsOptions } = require('./src/config/cors');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');

const registerRouter = require('./src/api/routes/register');
const usersRouter = require('./src/api/routes/users');
const eventsRouter = require('./src/api/routes/events');
const ticketsRouter = require('./src/api/routes/tickets');
const passesRouter = require('./src/api/routes/passes');
const cronRouter = require('./src/api/routes/cron');


//const  cleanUpdateOldData = require('./src/utils/cronJobs/cronJobs');

const app = express();


app.use(
     cors({
          origin: (origin, callback) => {

               const ACCEPTED_ORIGINS = [
                    "http://localhost:5173",
                    "http://localhost:5174",
                    "https://frontend.vercel.app",
               ];

               if (ACCEPTED_ORIGINS.includes(origin)) {

                    return callback(null, true);
               }

               if (!origin) {

                    return callback(null, true);

               }

               return callback(new Error("Not allowed by CORS"));
          },
          credentials: true,// Permite cookies y autenticación
          methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
          allowedHeaders: ['Content-Type', 'Authorization']
     })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

conectDDBB();

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
app.use('/api/v2/cron', cronRouter);



app.use('*', (req, res, next) => {

     return res.status(200).json('route not found 👽')

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

     console.log(`listening on port ${PORT} 😎`);

});



module.exports = app;

