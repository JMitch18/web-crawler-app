//dependencies
const request = require("request");
const cheerio = require("cheerio");
const exphbs = require("express-handlebars");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
//const path = require("path");

// creating express server
const app = express();

//user search term
let search = "";

//Imdb url
const frontUrl = "https://www.imdb.com/find?ref_=nv_sr_fn&q=";
const endUrl = "&s=all";

// Csv files
const writeStream = fs.createWriteStream("post1.csv");
const writeStream2 = fs.createWriteStream("post2.csv");

// Handlebars Middleware
app.engine(
  "handlebars",
  exphbs({
    /*defaultLayout: "main" */
  })
);
app.set("view engine", "handlebars");

// Body parser midddleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Index route
app.get("/", (req, res) => {
  const title = "IMDB WEB CRAWLER";
  res.render("index", { title: title });
});

// Index post route
app.post("/", (req, res) => {
  search = req.body.search;
  console.log(`Search term: ${search.toLowerCase()}`);

  let middleUrl = `${search}`; // User search term thats put in the middle of the url
  let completeUrl = frontUrl + middleUrl + endUrl; // Complete imdb url

  res.redirect(completeUrl);

  // Write header for post1
  writeStream.write(
    "==============================\nRequested Data in text format\n==============================\n\n"
  );

  // Write header for post2
  writeStream2.write(
    "==============================\nRequested Data in html format\n==============================\n\n"
  );

  // Scraping the data from the users search term
  request(completeUrl, (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html); // used to select things from the dom

      // // Removing the white space
      // console.log($.text().replace(/\s\s+/g, " "));

      // Writing scraped data to the post1.csv file in text format
      writeStream.write($.text().replace(/\s\s+/g, " "));

      // Writing scraped data to the post2.csv file in html format
      writeStream2.write($.html().replace(/\s\s+/g, " "));
    }
  });
});

// port
app.listen(process.env.PORT || 3000, () => {
  console.log("App is listening...");
});
