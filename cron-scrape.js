const cron = require('node-cron')
const scraper = require('./scraper')

cron.schedule('0 0 0 * * *', function() {
  scraper.scrape()
  // console.log('running a task every minute');
});