const fs = require('fs');
const FILEPATH = 'src/data.json'

const loadData = () => {
  try {
    const rawData = fs.readFileSync(FILEPATH)
    const data = JSON.parse(rawData)
    return data
  }
  catch(err) {
    console.error(err)
    saveData({posts: {}})
    return { posts: {} }
  }
}

const saveData = (data) => {
  try {
    const stringifiedData = JSON.stringify(data, null, 2);
    fs.writeFileSync(FILEPATH, stringifiedData)
  }
  catch(err) {
    console.error('error saving file: ',err)
  }
}

module.exports = {
  loadData, 
  saveData
}