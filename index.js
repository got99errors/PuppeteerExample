require('./src/cron-scrape')
const dataManager = require('./src/dataManager')
const express = require('express')
const app = express()
app.set('view engine', 'pug')
app.set('views', './src/views')
app.get('/', (req,res) => {
  const mediaItems = dataManager.getMediaItems()
  res.render('index', { mediaItems })
})
const port = process.env.PORT || "3000";
app.set("port", port);
app.listen(port, () => console.log("Listening on port",port))