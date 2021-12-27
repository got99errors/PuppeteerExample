const storageManager = require('./storageManager')
const data = storageManager.loadData()

const getMediaItems = () => {
  const { posts } = data
  const values = Object.values(posts).flat()
  console.log('media items', values)
  return values
}

const getPosts = () => {
  const values = Object.keys(data.posts)
  console.log('post links', values)
  return values
}

module.exports = {
  getMediaItems,
  getPosts
}