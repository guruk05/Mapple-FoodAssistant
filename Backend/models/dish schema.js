const mongoose = require('mongoose');
const { Schema } = mongoose;

const dishSchema = new Schema({
    dish: String,
    link: String
});

mongoose.model('dish', dishSchema);