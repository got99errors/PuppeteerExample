const { URL } = require('url')

const parseUrl = url => {
	const { pathname } = new URL(url)
	const [year, month, day, postId,] = pathname.split('/').filter(item => item.length)
	const date = new Date(Date.parse(`${year}-${month}-${day}`))
	return {postId, url, date}
}

module.exports = {
	parseUrl
}