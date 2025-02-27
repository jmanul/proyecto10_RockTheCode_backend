

const allowedOrigins = process.env.NODE_ENV === 'production'
     ? [
          process.env.FRONTEND_URL
     ]
     : '*';

const corsOptions = {
     origin: (origin, callback) => {

          if (!origin || allowedOrigins === '*' || allowedOrigins.includes(origin)) {
               callback(null, true);
          } else {
               callback(new Error('No autorizado por CORS'));
          }
     },
     credentials: true, // Permite cookies y autenticación
     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
     allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = {corsOptions};