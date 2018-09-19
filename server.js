var cheerio = require("cheerio");
var request = require("request");
var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var bodyParser = require("body-parser");
var logger = require("morgan");

//Initialize Express
var app = express();

var PORT = 3000;

//Database configuration
var databaseUrl = "scraperNews";
var collections = ["scrapeData"];

// Use body-parser for handling form submissions
//app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(express.static("public"));

var db=require("./models");

// Set up promises with mongoose
//mongoose.Promise = global.Promise;

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/scraperNews", {useNewUrlParser: true});


// A GET route for scraping the KCstar website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  axios.get("https://www.kansascity.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article h4").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

     // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    //res.send("Scrape Complete");
  });
});
//});












// // Making a request for kansas city star
// request("https://www.kansascity.com.", function(error, response, html) {

//   // Load the HTML into cheerio and save it to a variable
//   // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
//   var $ = cheerio.load(html);

//   // An empty array to save the data that we'll scrape
//   var results = [];

//   // With cheerio, find each p-tag with the "title" class
//   // (i: iterator. element: the current element)
//   $("article h4").each(function(i, element) {

//     // Save the text of the element in a "title" variable
//     var title = $(element).text();

//     // var summary = $(element).children("a href");

//     // In the currently selected element, look at its child elements (i.e., its a-tags),
//     // then save the values for any "href" attributes that the child elements may have
//     var link = $(element).children("a").attr("href");
//     //var summary = $(element).parent("class").attr("title");
    
    
//     // Add the text and href of every link, and save them as properties of the result object
//       // results.title = $(this)
//       //   .children("a")
//       //   .text();
//       // results.link = $(this)
//       //   .children("a")
//       //   .attr("href");

//     // Save these results in an object that we'll push into the results array we defined earlier
//     results.push({
//       title: title,
//       link: link,
//       // summary: summary
//     });
//   });

  // Log the results once you've looped through each of the elements found with cheerio
//   console.log(results);

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
