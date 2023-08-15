import { Configuration, OpenAIApi } from 'openai'
import fs from 'fs'
import { exec } from 'child_process'
import { tryy } from '../promptTemplates/image'

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API,
})
const openai = new OpenAIApi(configuration)

export const getImageQuerys = async () => {
	return new Promise((resolve, reject) => {
		fs.readFile('/home/chetan/code/ts-content-gpt/basicaudio.wav.srt', 'utf8', async function (err, data) {
			if (err) throw err
			const chatCompletion: any = await openai.createChatCompletion({
				model: 'gpt-3.5-turbo',
				messages: [{ role: 'system', content: tryy(data) }],
			})
			// console.log('chatCompletion: ', chatCompletion.data.choices[0].message)

			// console.log(JSON.stringify(chatCompletion.data.choices[0].message?.content)[0])

			const formattedString = chatCompletion.data.choices[0].message?.content.replace(/\\/g, '') // Remove escape characters
			const jsonArray = JSON.parse(formattedString)

			// console.log('jsonArray: ', jsonArray)

			if (!jsonArray || jsonArray?.length === 0) return reject('No jsonArray found')

			resolve(jsonArray)
		})
	})
}
