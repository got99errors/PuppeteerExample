const storageManager = require('./storageManager')
let data = storageManager.loadData()

const getMediaItems = () => {
  data = storageManager.loadData()
  const { posts } = data
  const values = Object.values(posts).map(post => post.items).flat()
  return values
}

const getPosts = () => {
  data = storageManager.loadData()
  const values = Object.values(data.posts)
  return values
}

const addPosts = (newPosts) => {
  data = storageManager.loadData()
  data = {posts: {...data.posts, ...newPosts}}
  storageManager.saveData(data)
}

const filterExistingPostsUrl = urls => {
  const existingPostsLinks = getPosts().map(post => post.url)
  return urls.filter(link => !existingPostsLinks.includes(link))
}

module.exports = {
  getMediaItems,
  filterExistingPostsUrl,
  getPosts,
  addPosts
}