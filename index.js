require('dotenv').config();
const express = require('express');
const { conectDDBB } = require('./src/config/ddbb');
const cloudinary = require('cloudinary').v2;

const registerRouter = require('./src/api/routes/register');
// const bandsRouter = require('./src/api/routes/bands');
// const leadersRouter = require('./src/api/routes/leaders');
// const stylesRouter = require('./src/api/routes/styles');



const app = express();

app.use(express.json());

conectDDBB();

cloudinary.config({

     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
     api_key: process.env.CLOUDINARY_API_KEY,
     api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use('/api/v1/register', registerRouter);
// app.use('/api/v1/bands', bandsRouter);
// app.use('/api/v1/leaders', leadersRouter);
// app.use('/api/v1/styles', stylesRouter);


app.use('*', (req, res, next) => {

     return res.status(200).json('route not found 👽')

});

app.listen('3000', () => {

     console.log('listening on port http://localhost:3000 😎');

});