//=====================================/
// Modules
//=====================================/
const fs = require('fs');
const osmosis = require('osmosis');
const json2csv = require('json2csv').parse;
//=====================================/
// Variables
//=====================================/
const fields = ['Title', 'Price', 'ImageURL', 'URL', 'Time'];
const opts = { fields };
const url = 'http://shirts4mike.com/shirts.php';
const baseUrl = 'http://shirts4mike.com/';
const dir = './data';
let shirts = [];
//=====================================/
// Scrape Data
//=====================================/
osmosis
    .get(url)
    .set({'URL': '.shirts a@href'})
    .follow('.products a@href')
    .set({
        'Title'    : '.shirt-picture @alt',
        'Price'    : '.price',
        'ImageURL' : 'img @src'
    })
    // Format object and push to shirts Array
    .data(function(properties) {
      properties.URL = baseUrl + properties.URL; 
      properties.Title = properties.Title.split(',')[0];
      properties.ImageURL = baseUrl + properties.ImageURL;
      properties.Time = date().time;

      shirts.push(properties);

      if(shirts.length >= 8) {
        createCSV();
      }
    })
    .error(function(error) {
      console.log(`Cannot connect to ${baseUrl}. Not Found.`)
    }); 
//=====================================/
// Create CSV
//=====================================/    
const createCSV = () => {
  try {
    let dateNow = date().day;
    const csvShirts = json2csv(shirts, opts);
    const csvPath = dir + '/' + dateNow + '.csv';
    // Create data folder, if there is none
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      console.log('Data directory was sucessfully created');
    } 
    // Create csv file with the data
    fs.writeFile(csvPath, csvShirts, (error) => {
      if (error) throw error;
      console.log('The file has been saved');
    });
    } catch (error) {
      console.error(`Unable to create CSV File. Error: ${error.message}`);
    }
};
//=====================================/
// Create Date and Time
//=====================================/   
const date = () => {
  const d = new Date();
  let day = `${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`;
  let time = `${d.getHours()}:${d.getMinutes()}`;
  return {day, time};
};