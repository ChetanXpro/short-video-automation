import { OpenAI } from 'langchain/llms/openai'
import { PromptTemplate } from 'langchain/prompts'
import ffmpeg from 'fluent-ffmpeg'
import { LLMChain } from 'langchain/chains'
import { imageTemp, tryy } from '../promptTemplates/image'
// import path from 'ffmpeg-static'

// ffmpeg.setFfmpegPath(path!)

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
	const inputVideoPath = '/Users/chetan/Developer/code/short-video-automation/shorts/test.mp4'

	const outputVideoPath = '/Users/chetan/Developer/code/short-video-automation/final.mp4'

	interface IQuery {
		Query: string
		timestamp: string
	}
	let queryArr: any = []

	for (const key in queries) {
		let value = queries[key]

		const newKey = `${Number(key)}-${Number(key) + 1}`

		const obj = {
			Query: value,
			timestamp: newKey,
		}

		queryArr.push(obj)
	}

	console.log('queryArr: ', queryArr)

	let filter = ''
	queryArr.forEach((query: IQuery, index: any) => {
		const currIndex = index + 1
		const prevIndex = index
		const totalQuery = queryArr.length
		const lastIndex = index === totalQuery - 1

		const [startingTime, endTime] = query.timestamp.split('-')
		if (index === 0) {
			let imgPath = ''

			queryArr.forEach((query: IQuery, index: any) => {
				imgPath +=
					' -i ' +
					`/Users/chetan/Developer/code/short-video-automation/${query.Query.split(' ').join('')}.jpg`
			})

			// const com = `/Users/chetan/Developer/code/short-video-automation/${}`

			filter += `${imgPath} -filter_complex "[${prevIndex}:v][${currIndex}:v]overlay=(W-w)/2:(H-h)/2:enable='between(t,${startingTime.trim()},${endTime.trim()})'[v${currIndex}];[v${currIndex}]`
			return
		}

		if (lastIndex) {
			filter += `[${currIndex}:v]overlay=(W-w)/2:(H-h)/2:enable='between(t,${startingTime.trim()},${endTime.trim()})'[v${currIndex}];[v${currIndex}]`
			filter += `format=yuv420p[v]"`
			return
		}

		filter += `[${currIndex}:v]overlay=(W-w)/2:(H-h)/2:enable='between(t,${startingTime.trim()},${endTime.trim()})'[v${currIndex}];[v${currIndex}]`
	})

	// console.log('filter: ', filter)

	const mainFilter = `ffmpeg -i ${inputVideoPath}  ${filter} -map "[v]" -map 0:a -c:v libx264 -c:a copy ${outputVideoPath} `

	console.log('mainFilter: ', mainFilter)

	exec(mainFilter, (err, stdout, stderr) => {
		if (err) {
			console.error(err)
			// console.log('stderr: ', stderr)
		}
		// console.log(stdout)

		console.log('Video processing done')

		// return new Promise.all()

		queryArr.forEach((query: IQuery, index: any) => {
			fs.unlink(
				`/Users/chetan/Developer/code/short-video-automation/${query.Query.split(' ').join('')}.jpg`,
				err => {
					if (err) {
						console.error(err)
						return
					}
					//file removed
				}
			)
		})
	})
}
