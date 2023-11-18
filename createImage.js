// const nodeHtmlToImage = require('node-html-to-image')
// import nodeHtmlToImage from 'node-html-to-image'
const fs = require('fs')

const createbase64 = async imagePath => {}

const upvoteURI = 'data:image/jpeg;base64,' + new Buffer.from(fs.readFileSync('./up-arrow.png')).toString('base64')
const commentURI = 'data:image/jpeg;base64,' + new Buffer.from(fs.readFileSync('./chat.png')).toString('base64')
const shareURI = 'data:image/jpeg;base64,' + new Buffer.from(fs.readFileSync('./share.png')).toString('base64')

// nodeHtmlToImage({
// 	type: 'png',
// 	transparent: true,

// 	output: './image.png',
// 	html: ,
// 	quality: 500,
// 	content: { upvote: upvoteURI, comment: commentURI, share: shareURI },
// }).then(() => console.log('The image was created successfully!'))

const puppeteer = require('puppeteer')

async function run() {
	const browser = await puppeteer.launch()
	const page = await browser.newPage()

	const content = `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          /* background: #000; */
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        body {
          background: #000;
        }
        .avatar {
          width: 40px;
          height: 40px;
          background: url('https://www.w3schools.com/howto/img_avatar.png') no-repeat center center;
          background-size: cover;
          border-radius: 50%;
        }
  
        .verifyed-tick {
          width: 15px;
          height: 15px;
          background: url('./verified.png') no-repeat center center;
          background-size: cover;
          border-radius: 50%;
        }
  
        .container {
          width: 18rem;
          display: flex;
          flex-direction: column;
          gap: 10px;
          border-radius: 10px;
          padding: 10px;
          background: white;
        }
  
        .upper {
          display: flex;
          align-items: center;
          gap: 10px;
          /* background: green; */
        }
        .question {
          font-size: 16px;
          font-weight: 600;
          /* background: gray; */
        }
        .upvote_logo {
          width: 18px;
          height: 18px;
          background-size: cover;
  
          /* background: #000; */
          background: url('./up-arrow.png') no-repeat center center;
        }
  
        .upvote_section {
          display: flex;
          align-items: center;
          gap: 5px;
  
          font-size: small;
        }
  
        .upvote_text {
          color: green;
        }
  
        .comment_logo {
          width: 18px;
          height: 18px;
        }
  
        .share_logo {
          width: 13px;
          height: 13px;
        }
        .lower_section {
          display: flex;
          gap: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="upper">
          <div class="avatar"></div>
          <p>Chetan</p>
          <div class="verifyed-tick"></div>
        </div>
        <div>
          <p class="question">I am not interested in coding, currently working as a software developer. I amm looking for a job which is secured and less stressful. I am 26. What should I do?</p>
        </div>
        <div class="lower_section">
          <div class="upvote_section">
            <img class="upvote_logo" src="${upvoteURI}" />
            <span class="upvote_text">21.2k Upvote</span>
          </div>
          <div class="upvote_section">
            <img src="${commentURI}" class="comment_logo" />
            <span>310</span>
          </div>
          <div class="upvote_section">
            <img class="share_logo" src="${shareURI}" />
            <span>67</span>
          </div>
        </div>
      </div>
    </body>
  </html>
  
  `

	await page.setContent(content)
	await page.setViewport({
		width: 1200,
		height: 1200,
		deviceScaleFactor: 3,
	})

	// Get the "viewport" of the page, as reported by the page.
	const element = await page.$('.container') // selector for your element
	const bbox = await element.boundingBox()

	await page.screenshot({
		path: 'element.jpg',
		type: 'jpeg',
		quality: 100,
		clip: {
			x: bbox.x,
			y: bbox.y,
			width: Math.min(bbox.width, page.viewport().width),
			height: Math.min(bbox.height, page.viewport().height),
		},
		omitBackground: true,
	})

	await browser.close()

	// await page.setContent(content)

	// // Set viewport with higher values
	// await page.setViewport({
	// 	width: 1280,
	// 	height: 1024,
	// 	deviceScaleFactor: 3, // you can even set this to 4 for higher quality
	// })

	// // Setting wait until as 'networkidle0' waits for network to be idle
	// // (No new network connections for at least 500ms)
	// await page.goto('about:blank', { waitUntil: 'networkidle0' })

	// const element = await page.$('.container')
	// if (element) {
	// 	const boundingBox = await element.boundingBox()

	// 	await page.screenshot({
	// 		path: 'element.png',
	// 		type: 'png',
	// 		clip: {
	// 			x: boundingBox.x,
	// 			y: boundingBox.y,
	// 			width: Math.min(boundingBox.width, page.viewport().width),
	// 			height: Math.min(boundingBox.height, page.viewport().height),
	// 		},
	// 		omitBackground: true,
	// 	})
	// } else {
	// 	console.log('Element not found!')
	// }

	// await browser.close()
}

run()
