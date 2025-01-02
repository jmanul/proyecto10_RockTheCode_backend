const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({

     name: { type: String, required: true, unique: true, trim: true },
     type: {
          type: String, enum: [
               "Music",
               "Sport",
               "Party",
               "Training",
               "Others"
          ],
          required: true
     },
     location: { type: String, required: true, unique: true, trim: true },
     description: { type: String, required: true, unique: true, trim: true },
     startDate: { type: Date, required: true },
     endDate: { type: String, default: "actuality" },
     roll: { type: String, required: true, enum: ["user", "administrator"], default: "user", trim: true },
     image: { type: String, required: true, trim: true },
     attendees: [{ type: mongoose.Types.ObjectId, ref: 'users', required: false }]

},
     {
          timestamps: true,
          collection: 'events'
     });


eventSchema.path('endDate').get((value) => value === "actuality" ? new Date() : value)


const Event = mongoose.model('events', userSchema, 'events');

module.exports = Event;