const mongoose = require('mongoose');

const privacyOptionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },            
    type: {                                                          
      type: mongoose.Schema.Types.ObjectId,
      ref : 'PropertyType',
      required: true,
    },
  },
  { timestamps: true }
);


privacyOptionSchema.index({ name: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('PrivacyOption', privacyOptionSchema);
