import { Configuration, OpenAIApi } from 'openai'
import fs from 'fs'
import { exec } from 'child_process'
import { tryy } from '../promptTemplates/image'

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API,
})
const openai = new OpenAIApi(configuration)

export const getImageQuerys = async () => {
	// fs.readFile('/home/chetan/code/ts-content-gpt/basicaudio.wav.srt', 'utf8', async function (err, data) {
	// 	if (err) throw err

	// })

	const file = fs.readFileSync('/home/chetan/code/ts-content-gpt/basicaudio.wav.srt', 'utf8')

	const chatCompletion: any = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo',
		messages: [{ role: 'system', content: tryy(file, 5) }],
	})
	// console.log('chatCompletion: ', chatCompletion)

	const obj = JSON.parse(chatCompletion.data.choices[0].message.content)

	return await obj
}
