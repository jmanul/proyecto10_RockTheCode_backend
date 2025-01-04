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
     adress: { type: String, required: true, unique: true, trim: true },
     city: { type: String, required: true, unique: true, trim: true },
     description: { type: String, required: true, unique: true, trim: true },
     startDate: { type: Date, required: true },
     endDate: { type: String, default: "actuality" },
     image: { type: String, default: "https://res.cloudinary.com/dn6utw1rl/image/upload/v1735935920/default/default-img_h3kfa1.webp"},
     attendees: [{ type: mongoose.Types.ObjectId, ref: 'users', required: false }],
     createdBy: { type: mongoose.Types.ObjectId, ref: 'users', required: true }

},
     {
          timestamps: true,
          collection: 'events'
     });


eventSchema.path('endDate').get((value) => value === "actuality" ? new Date() : value)


const Event = mongoose.model('events', eventSchema, 'events');

module.exports = Event;