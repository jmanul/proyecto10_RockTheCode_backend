
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { encrypt } = require('../../utils/crypto/crypto.js');


const userSchema = new mongoose.Schema({

     userName: { type: String, required: true, unique: true, trim: true },
     password: { type: String, required: true, trim: true, select: false },
     email: { type: String, required: false, lowercase: true, trim: true },
     tokenSecret: { type: String, default: () => crypto.randomBytes(32).toString("hex"), select: false },
     tokenVersion: { type: Number, default: 0 },
     roll: { type: String, enum: ["user", "administrator"], default: "user", trim: true },
     avatar: {
          type: String, default: "https://res.cloudinary.com/dn6utw1rl/image/upload/v1736008037/default/default-person-EDIT_vonfhq.jpg"
     },
     eventsIds: [{ type: mongoose.Types.ObjectId, ref: 'events', required: false }],
     passesIds: [{ type: mongoose.Types.ObjectId, ref: 'passes', required: false }],
     ticketsIds: [{ type: mongoose.Types.ObjectId, ref: 'tickets', required: false }]

},
     {
          timestamps: true,
          collection: 'users'
     });

userSchema.pre('save', async function (next) {


     try {
          // Verificar si la clave de encriptación existe
          if (!process.env.APP_CRYPTO_KEY) {
               throw new Error("APP_CRYPTO_KEY no está definida.");
          }

          // Si el usuario es nuevo o cambia la contraseña
          if (this.isModified('password')) {
               // Verificar si tokenSecret ya está generado, si no, asignarlo
               if (!this.tokenSecret) {
                    this.tokenSecret = crypto.randomBytes(32).toString("hex");
               }
              
               // Encriptar tokenSecret
               this.tokenSecret = await encrypt(this.tokenSecret, process.env.APP_CRYPTO_KEY);

               // Hashear la contraseña con un salt seguro
               const salt = await bcrypt.genSalt(10);
               this.password = await bcrypt.hash(this.password, salt);
          }

          // Incrementar tokenVersion
          this.tokenVersion += 1;

          next();
          
     } catch (error) {
          console.error("Error en pre-save:", error);
          next(error);
     }
});

// metodo para comparar contraseñas
userSchema.methods.comparePassword = async function (password) {
     return await bcrypt.compare(password, this.password);
};


const User = mongoose.model('users', userSchema, 'users');

module.exports = User;