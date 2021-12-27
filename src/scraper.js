const parseUtils = require('./utils/parse.utils')
const dataManager = require('./dataManager')
const puppeteer = require("puppeteer");

const WEBSITE_URL = "https://www.mmamania.com/midnight-mmamania-news";
const ENTRY_SELECTOR =
	"#content > div:nth-child(3) > div > div.l-segment.l-main-content.l-sidebar-fixed.river-segment-0 > div.l-col__main > div > div";
const CONTENT_SELECTOR = "div.c-entry-content";

module.exports.scrape = async function() {
	const browser = await puppeteer.launch({ args: ['--no-sandbox'] });

  // 1. Collect all links
	const page = await browser.newPage();

	await page.goto(WEBSITE_URL);
	await page.waitForSelector(ENTRY_SELECTOR);
	let urls = await page.$$eval(ENTRY_SELECTOR, (links) => {
		links = links.map((el) => el.querySelector("div > a").href);
		return links;
	});
  
  urls = dataManager.filterExistingPostsUrl(urls)

	if (urls.length === 0) {
    return
  }

	urls = urls.map(parseUtils.parseUrl)

	// 2. Loop through each of those links, open a new page instance and get the relevant iframes
	const pagePromise = (link) =>
		new Promise(async (resolve, reject) => {
			let newPage = await browser.newPage();
			await newPage.goto(link);
			await newPage.waitForSelector(CONTENT_SELECTOR);
			const mediaItems = await newPage.$eval(CONTENT_SELECTOR, (content) => {
				const headers = content.querySelectorAll("h2");
				const totalHeaders = Object.keys(headers).length;
				const header = headers[totalHeaders - 2];
				const lastHeader = headers[totalHeaders - 1];
				let sibling = header.nextSibling;
				let divs = [];
				// iterate elements between the target H2 tag to the following H2
				while (sibling !== lastHeader) {
					if (sibling.tagName === "DIV") {
						divs.push(sibling);
					}
					sibling = sibling.nextSibling;
				}
				const iframes = divs.map((div) => div.querySelector("iframe").src);
				return iframes;
			});
			resolve(mediaItems);
			await newPage.close();
		});

	let currentPageData, posts = {};
	
	for (key in urls) {
    const {url, date, postId} = urls[key]
		currentPageData = await pagePromise(url);
    posts[postId] = {items: currentPageData, date, url}
	}
	
	dataManager.addPosts(posts)
}