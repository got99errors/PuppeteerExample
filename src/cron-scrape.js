const cron = require('node-cron')
const scraper = require('./scraper')
scraper.scrape()
// cron.schedule('5 * * * *', function() {
//   scraper.scrape()
//   // console.log('running a task every minute');
// });