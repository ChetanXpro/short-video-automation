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

export const imageProccessing = async ({ language, topic }: { language?: string; topic?: string }) => {
	const inputVideoPath = '/home/chetan/code/ts-content-gpt/tryyyyyyyyy.mp4'
	const inputImagePath = '/home/chetan/code/ts-content-gpt/oo.jpg'
	const outputVideoPath = '/home/chetan/code/ts-content-gpt/yyooooooo.mp4'
	const targetTimestamp = '00:00:10.000'

	const queries = [
		{ Query: 'Great Wall of China', timestamp: '1 -> 3' },
		{ Query: 'longest wall in the world', timestamp: '5 -> 8' },
		// { Query: 'Ming Dynasty', timestamp: '7 -> 8' },
		// { Query: 'Chinese Empire', timestamp: '11 -> 12' },
		// { Query: 'brick, tamperth, and stone', timestamp: '17 -> 18' },
	]

	interface IQuery {
		Query: string
		timestamp: string
	}
	let filter = ''
	queries.forEach((query: IQuery, index) => {
		const currIndex = index + 1
		const prevIndex = index
		const totalQuery = queries.length
		const lastIndex = index === totalQuery - 1

		const [startingTime, endTime] = query.timestamp.split('->')
		if (index === 0) {
			filter += ` -filter_complex "[${prevIndex}:v][${currIndex}:v]overlay=25:25:enable='between(t,${startingTime.trim()},${endTime.trim()})'[v${currIndex}];[v${currIndex}]`
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

	const mainFilter = `${path} -i ${inputVideoPath} -i ${inputImagePath} -i ${inputImagePath} ${filter} -map "[v]" -map 0:a -c:v libx264 -c:a copy ${outputVideoPath} `

	console.log('mainFilter: ', mainFilter)

	const ll = `${path} -i ${inputVideoPath} -i ${inputVideoPath} -i ${inputImagePath} -filter_complex "[0:v][1:v]overlay=25:25:enable='between(t,1 , 2)'[v1];[v1][2:v]overlay=25:25:enable='between(t,3 , 4)'[v2];[v2]format=yuv420p[v]" -map "[v]" -map 0:a -c:v libx264 -c:a copy /home/chetan/code/ts-content-gpt/yyooooooo.mp4`

	// const command = `${path} -i ${inputVideoPath} -i ${inputImagePath} -filter_complex "[0:v][1:v] overlay=25:25:enable='between(t,0,10)'" -pix_fmt yuv420p -c:a copy ${outputVideoPath}`
	// const command = `${path} -i ${inputVideoPath} -i ${inputImagePath} -filter_complex "[1:v]scale=-1:100[ovrl];[0:v][ovrl]overlay=x=W-w-10:y=10:enable='between(t,${targetTimestamp},T)'[out]" -map "[out]" -map 0:a -c:v libx264 -c:a copy ${outputVideoPath}`
	// const i = `[0:v][1:v]overlay=25:25:enable='between(t,1 , 2)'[v1]; [v1][2:v]overlay=25:25:enable='between(t,3 , 4)'[v2];  [v2]format=yuv420p[v]" -map "[v]" -map 0:a -c:v libx264 -c:a copy /home/chetan/code/ts-content-gpt/yyooooooo.mp4`
	// const command = `${path} -i ${inputVideoPath} -i ${inputImagePath} -i ${inputImagePath} -filter_complex "[0:v][1:v]overlay=25:25:enable='between(t,0,10)'[v1];  [v1][2:v]overlay=50:50:enable='between(t,15,20)'[v2];  [v2]format=yuv420p[v]" -map "[v]" -map 0:a -c:v libx264 -c:a copy ${outputVideoPath}`
	// const command = `${path} -i ${inputVideoPath} -i ${inputImagePath} -i ${inputImagePath} -i ${inputImagePath} -filter_complex "    [0:v][1:v]overlay=25:25:enable='between(t,0,10)'[v1];[v1] [2:v]overlay=50:50:enable='between(t,13,20)'[v2];  [v2][3:v]overlay=75:75:enable='between(t,23,30)'[v3];  [v3]format=yuv420p[v]" -map "[v]" -map 0:a -c:v libx264 -c:a copy ${outputVideoPath}`

	// const command = `${path} -i ${inputVideoPath} -i ${inputImagePath} -i ${inputImagePath} -i ${inputImagePath} -i ${inputImagePath} -i ${inputImagePath} -filter_complex "[0:v][1:v]overlay=25:25:enable='between(t,0,5)'[v1];[v1][2:v]overlay=50:50:enable='between(t,7,13)'[v2];[v2][3:v]overlay=75:75:enable='between(t,12,16)'[v3];[v3][4:v]overlay=100:100:enable='between(t,18,22)'[v4];[v4][5:v]overlay=125:125:enable='between(t,24,26)'[v5];[v5]format=yuv420p[v]" -map "[v]" -map 0:a -c:v libx264 -c:a copy ${outputVideoPath}`

	exec(mainFilter, (err, stdout, stderr) => {
		if (err) {
			console.error(err)
			// console.log('stderr: ', stderr)
		}
		// console.log(stdout)
	})

	return
	ffmpeg()
		.input(inputVideoPath)
		.input(inputImagePath)
		.complexFilter([
			{
				filter: 'setpts',
				options: `PTS-STARTPTS+(gte(T,${targetTimestamp})*(${targetTimestamp}-PTS/TB))`,
				outputs: 'timestamped',
			},
			{
				filter: 'overlay',
				options: {
					x: 'W-w-10',
					y: '10',
				},
				inputs: ['timestamped', '1'], // Use the 'timestamped' output from the previous filter and the image input
				outputs: 'out',
			},
		])
		.outputOptions('-map', '[out]')
		.outputOptions('-c:v', 'libx264')
		.output(outputVideoPath)
		.on('end', () => {
			console.log('Image overlay complete!')
		})
		.on('error', err => {
			console.error(err)
		})
		.run()

	return
	fs.readFile('/home/chetan/code/ts-content-gpt/basicaudio.wav.srt', 'utf8', async function (err, data) {
		if (err) throw err
		const chatCompletion = await openai.createChatCompletion({
			model: 'gpt-3.5-turbo',
			messages: [{ role: 'system', content: tryy(data) }],
		})
		console.log('chatCompletion: ', chatCompletion.data.choices[0].message)
	})
}
