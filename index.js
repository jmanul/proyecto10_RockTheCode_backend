require('dotenv').config()

const express = require('express');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
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
const countriesRouter = require('./src/api/routes/countries');


//const  cleanUpdateOldData = require('./src/utils/cronJobs/cronJobs');

const app = express();

// Rate limiter estricto para autenticación y registro (prevenir fuerza bruta)
const authLimiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutos
     max: 15, // 15 intentos por ventana
     message: 'Demasiados intentos de autenticación. Por favor, intenta de nuevo más tarde.',
     standardHeaders: true,
     legacyHeaders: false,
     skipSuccessfulRequests: true, // No contar intentos exitosos
});

// Rate limiter para operaciones de escritura críticas (crear, actualizar, eliminar)
const writeLimiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutos
     max: 50, // 50 operaciones de escritura por ventana
     message: 'Demasiadas operaciones. Por favor, intenta de nuevo más tarde.',
     standardHeaders: true,
     legacyHeaders: false,
     skip: (req) => req.method === 'GET', // No limitar lecturas
});

// Rate limiter general más permisivo para operaciones comunes
const generalLimiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutos
     max: 200, // 200 peticiones por ventana
     message: 'Demasiadas peticiones. Por favor, intenta de nuevo más tarde.',
     standardHeaders: true,
     legacyHeaders: false,
});


app.use(
     cors({
          origin: (origin, callback) => {

               const ACCEPTED_ORIGINS = [
                    "http://localhost:5173",
                    "http://localhost:5174",
                    process.env.FRONTEND_URL?.replace(/\/$/, ''), // Sin barra final
               ].filter(Boolean); // Filtra valores undefined/null

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

// Rutas con autenticación crítica (registro, login, recuperación de contraseña)
app.use('/api/v2/register', authLimiter, registerRouter);
app.use('/api/v2/users', authLimiter, usersRouter);

// Rutas con operaciones de escritura (eventos, tickets, passes)
app.use('/api/v2/events', writeLimiter, eventsRouter);
app.use('/api/v2/tickets', writeLimiter, ticketsRouter);
app.use('/api/v2/passes', writeLimiter, passesRouter);

// Rutas de solo lectura con límite general
app.use('/api/v2/countries', generalLimiter, countriesRouter);

// Cron jobs sin rate limiting (protegido por token en el controlador)
app.use('/api/v2/cron', cronRouter);



app.use('*', (req, res, next) => {

     return res.status(200).json('route not found 👽')

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

     console.log(`listening on port ${PORT} 😎`);

});



module.exports = app;

