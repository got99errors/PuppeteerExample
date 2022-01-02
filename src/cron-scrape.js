const cron = require('node-cron')
const scraper = require('./scraper')

// TODO: when finish scrape, reload json file
cron.schedule('0 0 0 * * *', function() {
  scraper.scrape()
});