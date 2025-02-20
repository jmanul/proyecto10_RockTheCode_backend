
const { cleanUpdateOldData } = require("../../utils/cronJobs/cronJobs");

const runCronJob = async (req, res, next) => {

     try {

          const authHeader = req.headers.authorization;

          if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
               return res.status(401).json({ error: 'Acceso no autorizado' });
          }

          await cleanUpdateOldData();

          res.status(200).json({ message: 'Cron job ejecutado exitosamente' });

     } catch (error) {

          console.error('Error al ejecutar el cron job:', error.message);
          res.status(500).json({ error: 'Error al ejecutar el cron job' });

     }
};

module.exports = { runCronJob };
