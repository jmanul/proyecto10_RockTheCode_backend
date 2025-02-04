
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { encrypt } = require('../../utils/crypto/crypto.js');


const userSchema = new mongoose.Schema({

     userName: { type: String, required: true, unique: true, trim: true },
     password: { type: String, required: true, trim: true, select: false },
     email: { type: String, required: false, unique: true, lowercase: true, trim: true },
     tokenSecret: { type: String, select: false },
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

          next();

     } catch (error) {

          next({ error: error.message });
     }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (password) {
     return await bcrypt.compare(password, this.password);
};


const User = mongoose.model('users', userSchema, 'users');

module.exports = User;