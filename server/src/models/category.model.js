const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    slug: {
        type: String,
        unique: true,
        lowercase: true,
    },

    image: {
        type: String,
        default: "",
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }

}, {
    timestamps: true,
});

module.exports = mongoose.model("Category", categorySchema);