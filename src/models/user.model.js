import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: false,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
        minLength: 6
    },
    profilePic: {
        type: String,
        default: null,
    },
    followers: {
        type: Array,
        default: [],
    },
    following:{
        type: Array,
        default: [],
    }
},
{
    timestamps: true,
});

const User = mongoose.model("User", userSchema);

export default User;