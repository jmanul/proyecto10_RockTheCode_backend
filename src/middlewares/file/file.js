
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({

     cloudinary: cloudinary,
     params: async (req, file) => {

          const defaultFolder = nameFolder(req);

          return {
               folder: defaultFolder,
               allowedFormats: ['jpg', 'png', 'jpeg', 'gif', 'webp', 'svg']
          };
     }
    
});

const upload = multer({ storage: storage });

module.exports = upload;

const nameFolder = (req) => {

     const route = req.baseUrl; 

     if (route.includes('users')) return 'users-events';
     if (route.includes('events')) return 'events';
     return 'default'; 
};