//dependencies
const request = require("request");
//const cheerio = require("cheerio");

request("https://www.imdb.com/", (error, response, html) => {
  if (!error && response.statusCode == 200) {
    //const $ = cheerio.load(html);
    console.log(html);
  } else {
    console.log(`Error: ${error}`);
  }
});
