

var mongoose = require("mongoose");

//save a reference to the schema contructor
var schema = mongoose.schema;

var articleSchema = new schema({
    //headline is required and of type string
    headline:{
        type: String,
        required: true
    },

    //summary is required and of type string
    summary:{
        type: String,
        required: true
    },
    //link is required and of type string
    link:{
        type: String,
        required: true
    },
    //note is an object that stores a note id
    //the ref property links the objectId to the note model
    //this allows us to populate the article with an associated note
    note:{
        type: Schema.Types.ObjectId,
        ref:"Note"
    }
});


var Article = mongoose.model("Article", articleSchema);

module.exports = {
    Article
};