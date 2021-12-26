const puppeteer = require("puppeteer");
const URL = "https://www.mmamania.com/midnight-mmamania-news";
const ENTRY_SELECTOR =
	"#content > div:nth-child(3) > div > div.l-segment.l-main-content.l-sidebar-fixed.river-segment-0 > div.l-col__main > div > div";
const CONTENT_SELECTOR = "div.c-entry-content";

module.exports.scrape = async function() {
	const browser = await puppeteer.launch({});

  // 1. Collect all links
	const page = await browser.newPage();

	await page.goto(URL);
	await page.waitForSelector(ENTRY_SELECTOR);
	const urls = await page.$$eval(ENTRY_SELECTOR, (links) => {
		links = links.map((el) => el.querySelector("div > a").href);
		return links;
	});
	console.log("urls", urls.length);

	// 2. Loop through each of those links, open a new page instance and get the relevant iframes
	let pagePromise = (link) =>
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
					console.log(sibling.tagName);
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

	let iframeURLs = [];
	let currentPageData;
	for (link in urls) {
    console.log(`scraping link ${urls[link]}`);
		currentPageData = await pagePromise(urls[link]);

    console.log(`found ${currentPageData.length} items`);
		iframeURLs = iframeURLs.concat(currentPageData);
	}
  console.log(iframeURLs)
}