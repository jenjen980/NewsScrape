

var mongoose = require("mongoose");

//save reference to the schema
var schema = mongoose.schema;

//using the schema, create a noteschema object
var noteSchema = new schema({
    //title is of type string
    title: String,
    //body is of type string
    body: String
});

//creates the model from the schema, using mongoose's model method
var Note = mongoose.model("Note", noteSchema);

//export the note model
module.exports = Note;