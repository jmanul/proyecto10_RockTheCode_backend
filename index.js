require('dotenv').config();
const express = require('express');
const { conectDDBB } = require('./src/config/ddbb');
const cloudinary = require('cloudinary').v2;

const registerRouter = require('./src/api/routes/register');
const usersRouter = require('./src/api/routes/users');
const eventsRouter = require('./src/api/routes/events');
const  ticketsRouter = require('./src/api/routes/tickets');


const app = express();

app.use(express.json());

conectDDBB();

cloudinary.config({

     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
     api_key: process.env.CLOUDINARY_API_KEY,
     api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use('/api/v1/register', registerRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/events', eventsRouter);
app.use('/api/v1/tickets', ticketsRouter);



app.use('*', (req, res, next) => {

     return res.status(200).json('route not found 👽')

});

app.listen('3000', () => {

     console.log('listening on port http://localhost:3000 😎');

});