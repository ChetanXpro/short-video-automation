import { Configuration, OpenAIApi } from 'openai'
import fs from 'fs'
import { exec } from 'child_process'
import { tryy } from '../promptTemplates/image'

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API,
})
const openai = new OpenAIApi(configuration)

export const getImageQuerys = async (subtitlesPath: string) => {
	// fs.readFile('/home/chetan/code/ts-content-gpt/basicaudio.wav.srt', 'utf8', async function (err, data) {
	// 	if (err) throw err

	// })

	const file = fs.readFileSync(subtitlesPath, 'utf8')

	const chatCompletion: any = await openai.createChatCompletion({
		model: 'gpt-4',
		messages: [{ role: 'system', content: tryy(file, 5) }],
	})
	console.log('chatCompletion: ', chatCompletion.data.choices[0].message.content)

	const obj = JSON.parse(chatCompletion.data.choices[0].message.content)

	return await obj
}
