
const QRCode = require('qrcode');

const qrGenerator = async (data) => {
     try {
          const qrCode = await QRCode.toDataURL(JSON.stringify(data));
          return qrCode;
     } catch (error) {
          throw new Error(`error generando el QR: ${error.message}`);
     }
};

module.exports = qrGenerator;
