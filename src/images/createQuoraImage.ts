

import fs from 'fs'

import puppeteer from "puppeteer"


const upvoteURI = 'data:image/jpeg;base64,' +  Buffer.from(fs.readFileSync('/Users/chetan/Developer/code/short-video-automation/up-arrow.png')).toString('base64')
const commentURI = 'data:image/jpeg;base64,' +  Buffer.from(fs.readFileSync('/Users/chetan/Developer/code/short-video-automation/chat.png')).toString('base64')
const shareURI = 'data:image/jpeg;base64,' +  Buffer.from(fs.readFileSync('/Users/chetan/Developer/code/short-video-automation/share.png')).toString('base64')
const varifiedURI = 'data:image/jpeg;base64,' +  Buffer.from(fs.readFileSync('/Users/chetan/Developer/code/short-video-automation/verified.png')).toString('base64')

export async function createQuoraImages(question: string,upvote:string,comment:string,share:string,quoraTemplatePath:string) {
	const browser = await puppeteer.launch({
        headless:true
    })
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
          
          background-size: cover;
          border-radius: 50%;
        }
  
        .verifyed-tick {
          width: 15px;
          height: 15px;
          
          background-size: cover;
          border-radius: 50%;
        }
  
        .container {
        	width: fit-content;
				max-width: 30rem;
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
        <img src="https://www.w3schools.com/howto/img_avatar.png" class="avatar" />
          <p>Chetan</p>
          <div class="verifyed-tick"></div>
          <img src="${varifiedURI}" class="verifyed-tick" />
        </div>
        <div >
          <p class="question">${question}</p>
        </div>
        <div class="lower_section">
          <div class="upvote_section">
            <img class="upvote_logo" src="${upvoteURI}" />
            <span class="upvote_text">${upvote} Upvote</span>
          </div>
          <div class="upvote_section">
            <img src="${commentURI}" class="comment_logo" />
            <span>${comment}</span>
          </div>
          <div class="upvote_section">
            <img class="share_logo" src="${shareURI}" />
            <span>${share}</span>
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
	const element = await page.$('.container') 

    if(!element) throw new Error('Element not found')
	const bbox = await element.boundingBox()

    if(!bbox) throw new Error('Bounding box not found')
    

    

	await page.screenshot({
		path: quoraTemplatePath,
		type: 'jpeg',
		quality: 100,
		clip: {
			x: bbox.x,
			y: bbox.y,
			width: Math.min(bbox.width, page.viewport()?.width || 0),
			height: Math.min(bbox.height, page.viewport()?.height || 0),
		},
		omitBackground: true,
	})

	await browser.close()

	
}


