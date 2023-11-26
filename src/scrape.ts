import axios from 'axios'
import cheerio from 'cheerio'
import puppeteer from 'puppeteer'

export async function scrapeQuora(url: string) {
	const browser = await puppeteer.launch()
	const page = await browser.newPage()
	await page.goto(url)

	const results = await page.evaluate(() => {
		const qElement = document.querySelector('.puppeteer_test_question_title span span') as any
		const question = qElement ? qElement.innerText : null

		// The name is within <span><span> which is within <a>. We can use this hierarchy to get the name.
		const nElement = document.querySelector(
			'.q-inlineFlex.qu-alignItems--center.qu-wordBreak--break-word span span'
		) as any
		const name = nElement ? nElement.innerText : null

		const elements = Array.from(
			document.querySelectorAll('.q-text.qu-display--block.qu-wordBreak--break-word.qu-textAlign--start') as any
		)
		const texts = elements.map((element: any) => element.innerText)
		const answer = texts.join(' ')

		return { question, name, answer }
	})

	console.log(results)

	await browser.close()
}
