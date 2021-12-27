const fs = require('fs');
const FILEPATH = process.cwd()+'/data.json'

const loadData = () => {
  try {
    if (!fs.existsSync(FILEPATH)) {
      saveData({posts: {}})
    }
    const rawData = fs.readFileSync(FILEPATH, 'utf8')
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