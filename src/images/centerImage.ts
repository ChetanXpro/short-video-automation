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

export const 
centerImage = async ({ path, videoPath }: { path: string; videoPath: string }) => {
	// console.log('filter: ', filter)

	const mainFilter = `ffmpeg -y -i ${videoPath} -i ${path} -filter_complex "[1]scale=-1:300[img]; [0][img]overlay=(W-w)/2:(H-h)/6" output.mp4`

	// const mainFilter = `ffmpeg -y -i ${videoPath} -i ${path} -filter_complex "[0]scale='min(800,iw)':-1[img]; [0][img]overlay=(W-w)/2:(H-h)/2:enable='between(t,0,5)'" output.mp4
	// `
	//                  ffmpeg -i input.mp4 -i image.png  -filter_complex "[0]scale=1280:720 [video]; [1]scale=400:-1 [image]; [video][image]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2:enable='between(t,0,5)'" output.mp4

	console.log('mainFilter: ', mainFilter)

	return new Promise((resolve, reject) => {
		exec(mainFilter, (err, stdout, stderr) => {
			if (err) {
				console.error(err)
				// console.log('stderr: ', stderr)
				reject(err)
			}
			// console.log(stdout)
	
			console.log('Video processing done')
			resolve(stdout)
	
	
		})
	})

	
}
