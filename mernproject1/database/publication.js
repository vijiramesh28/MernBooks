const mongoose = require('mongoose');

//Creating Schema
const PublicationSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: [String]
});

//Creating model
const PublicationModel = mongoose.model("Publications", PublicationSchema);


//exports
module.exports = PublicationModel;