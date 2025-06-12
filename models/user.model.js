const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({ 
    firstName: {
        type: String,
        required: [true, "Please enter your first name"],
    },
    lastName: {
        type: String,
        required: [true, "Please enter your last name"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email address"],
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    mobile: {
        type: String,
        required: [true, "Please enter your mobile number"],
        match: [/^\d{10}$/, "Please enter a valid 10-digit mobile number"],
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: [6, "Password must be at least 6 characters long"],
    },
    profilePic:{
        public_id: {
            type: String,
            required: [true, "Please upload a profile picture"],
        },
        url: {
            type: String,
            required: [true, "Please upload a profile picture"],
        },  
    },
    role: {
        type: String,
        enum: ["user", "host", "admin"],
        default: "user",
    },
    googleId: {
        type: String,
        default: null,
    },
    address: {
        type: String,
        required: [true, "Please enter your address"],
    },
    
    createdAt: {
        type: Date,
        default: Date.now,
    },
 });

 userSchema.virtual("isGoogleUser").get(function(){
    return  !!this.googleId;
 })

 module.exports = mongoose.model("User", userSchema);