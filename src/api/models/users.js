
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { encrypt } = require('../../utils/crypto/crypto.js');


const userSchema = new mongoose.Schema({

     userName: { type: String, required: true, unique: true, trim: true },
     password: { type: String, required: true, trim: true, select: false },
     email: { type: String, required: false, lowercase: true, trim: true },
     tokenSecret: {
          type: String,
          default: () => {
               try {
                    const randomValue = crypto.randomBytes(64).toString("hex");
                    return encrypt(randomValue);
               } catch (error) {
                    console.error("Error generando tokenSecret:", error.message);
                    // Valor de respaldo (no encriptado)
                    return crypto.randomBytes(64).toString("hex");
               }
          },
          select: false
     },
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

     if (!this.isModified('password')) return next();

     try {
          this.tokenSecret = crypto.randomBytes(64).toString("hex");
          const salt = await bcrypt.genSalt(10);

          this.password = await bcrypt.hash(this.password, salt);
          this.tokenSecret = encrypt(this.tokenSecret)

          // Incrementar tokenVersion
          this.tokenVersion += 1;

          next();

     } catch (error) {

          next({ error: error.message });
     }
});

// metodo para comparar contraseñas
userSchema.methods.comparePassword = async function (password) {
     return await bcrypt.compare(password, this.password);
};


const User = mongoose.model('users', userSchema, 'users');

module.exports = User;