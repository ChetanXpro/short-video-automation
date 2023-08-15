import { OpenAI } from 'langchain/llms/openai'
import { PromptTemplate } from 'langchain/prompts'
import ffmpeg from 'fluent-ffmpeg'
import { LLMChain } from 'langchain/chains'
import { imageTemp, tryy } from '../promptTemplates/image'
import path from 'ffmpeg-static'

ffmpeg.setFfmpegPath(path!)

import { Configuration, OpenAIApi } from 'openai'
import fs from 'fs'
import { exec } from 'child_process'

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API,
})
const openai = new OpenAIApi(configuration)

export const imageProccessing = async ({
	language,
	topic,
	queries,
}: {
	language?: string
	topic?: string
	queries: any
}) => {
	const inputVideoPath = '/home/chetan/code/ts-content-gpt/tryyyyyyyyy.mp4'
	const inputImagePath = '/home/chetan/code/ts-content-gpt/oo.jpg'
	const outputVideoPath = '/home/chetan/code/ts-content-gpt/yyooooooo.mp4'
	const targetTimestamp = '00:00:10.000'

	interface IQuery {
		Query: string
		timestamp: string
	}
	let filter = ''
	queries.forEach((query: IQuery, index: any) => {
		const currIndex = index + 1
		const prevIndex = index
		const totalQuery = queries.length
		const lastIndex = index === totalQuery - 1

		const [startingTime, endTime] = query.timestamp.split('->')
		if (index === 0) {
			let imgPath = ''

			queries.forEach((query: IQuery, index: any) => {
				imgPath += ' -i ' + `/home/chetan/code/ts-content-gpt/${query.timestamp.split('->')[0].trim()}.jpg`
			})

			filter += `${imgPath} -filter_complex "[${prevIndex}:v][${currIndex}:v]overlay=25:25:enable='between(t,${startingTime.trim()},${endTime.trim()})'[v${currIndex}];[v${currIndex}]`
			return
		}

		if (lastIndex) {
			filter += `[${currIndex}:v]overlay=25:25:enable='between(t,${startingTime.trim()},${endTime.trim()})'[v${currIndex}];[v${currIndex}]`
			filter += `format=yuv420p[v]"`
			return
		}

		filter += `[${currIndex}:v]overlay=25:25:enable='between(t,${startingTime.trim()},${endTime.trim()})'[v${currIndex}];[v${currIndex}]`
	})

	// console.log('filter: ', filter)

	const mainFilter = `${path} -i ${inputVideoPath}  ${filter} -map "[v]" -map 0:a -c:v libx264 -c:a copy ${outputVideoPath} `

	console.log('mainFilter: ', mainFilter)

	exec(mainFilter, (err, stdout, stderr) => {
		if (err) {
			console.error(err)
			// console.log('stderr: ', stderr)
		}
		// console.log(stdout)
	})
}
