import dotenv from 'dotenv'
dotenv.config()
const os = require("os");


import { createShortScript, summarizeShortScript } from './videoScript'
import { convertToWav, createAudio } from './audio/elevenAudio'
import { whisper } from './transcript/transcribe'
import fs from 'fs'
import express from 'express'
const app = express()
import path from 'path'

import { mergeAudio } from './video/video'

// import { uploadVideos } from './upoad/upload'
// import uploadFile from './upoad/azureUpload'
import { imageProccessing } from './images/imagesProccessing'
import { downloadImages } from './images/downloadImages'
import { getImageQuerys } from './Editing/getImageQuerys'
import { processVTTFile } from './utils/utils'
import { centerImage } from './images/centerImage'
import { mergeTwoAudios } from './audio/mergeTwoAudio'
import { createQuoraImages } from './images/createQuoraImage'



const tmpdir = os.tmpdir();
console.log(tmpdir);



const answerAudioFilePath = path.join(tmpdir, 'answer.mp3')
const questionAudioFilePath = path.join(tmpdir, 'question.mp3')

const quoraAudioFilePath = path.join (tmpdir, 'quora.mp3')

const outputFilePath =     path.join (tmpdir, 'basicaudio.wav')

const videoFilePath =  path.join (__dirname, ".." , 'base.mp4')

const outputVideoFilePath = path.join(tmpdir, 'test.mp4')
const subTitlesFilePath = path.join(tmpdir, 'quora.wav.vtt')
const quoraTemplatePath = path.join(tmpdir, 'quoraTemplate.jpg')

// const generateYoutubeShort = async (language: string, topic: string) => {
// 	try {
// 		const startTime = performance.now()
// 		// const script = await createShortScript({ language: language, topic: topic })

// 		// console.log('SCRIPT GENERATED: ', script)

// 		// if (!script) throw new Error('Script not generated')

// 		const question = 'I am not interested in coding, currently working as a software developer. I amm looking for a job which is secured and less stressful. I am 26. What should I do?'

// 		const script = `

// 		Well sir/mam, go for teaching job in KV. I’m not saying that teaching job is not stressful, it is very stressful for those teachers who really want to make a difference in society through tutoring and guiding students to become a well behaved responsible, curious and accountable citizen. For others who want to become below the average teachers, you will have your job if you become a KV teacher. Those who say that corporate sectors pay high salary, they really need to take into account government job’s cash + short/long term benefits like residence, hospital, half fees cover/reimbursement in case of external medical consultation etc and then you will notice that high salary of corporate job and low cash salary of government job +benefits become nearby equivalent in terms of saving. Again, I will repeat, a good teacher’s job is very very stressful.

// The job in corporate sector will sometime be very stressful and some times it won't be, but if you don't like coding, you will start forgetting it and will affect your performance and may lead to getting fired, and worst consequence could be getting into depression. This is a myth where people say that in big companies work life balance is good, there is no such thing, it totally depends on how agressive the management is in their vision. So, if you don't want to be a teacher too, then better find what you are passionate about and see how you can convert your passion into earning.`

// 		const finalScript = await summarizeShortScript({ script })

// 		await createAudio({ script: question + ' ' + finalScript, language, outputFilePath: inputFilePath })

// 		// console.log('AUDIO GENERATED SUCCESSFULLY', 'basicaudio.mp3')

// 		await convertToWav(inputFilePath, outputFilePath)

// 		const currentDir = process.cwd()

// 		await whisper(outputFilePath)

// 		process.chdir(currentDir)
// 		// // return

// 		// console.log('MERGING AUDIO AND VIDEO')

// 		await processVTTFile('/Users/chetan/Developer/code/short-video-automation/basicaudio.wav.vtt')

// 		await mergeAudio({
// 			videoFilePath,
// 			audioFilePath: outputFilePath,
// 			outputVideoPath: outputVideoFilePath,
// 		})

// 		await centerImage({
// 			path: '/Users/chetan/Developer/code/short-video-automation/element.jpg',
// 			videoPath: '/Users/chetan/Developer/code/short-video-automation/shorts/test.mp4',
// 		})

// 		// return

// 		// const queries: any = await getImageQuerys(
// 		// 	'/Users/chetan/Developer/code/short-video-automation/basicaudio.wav.vtt'
// 		// )

// 		// if (!queries) throw new Error('Queries not generated')

// 		// console.log('QUERIES: ', typeof queries)

// 		// await downloadImages(Object.values(queries))

// 		// await imageProccessing({
// 		// 	language: '',
// 		// 	queries: queries,
// 		// })

// 		const endTime = performance.now()

// 		// Calculate the elapsed time in seconds
// 		const elapsedTimeInSeconds = (endTime - startTime) / 1000

// 		console.log(`Function took ${elapsedTimeInSeconds} seconds to finish.`)

// 		return
// 		// Upload to youtube
// 		// uploadFile('videos', Math.random() + 'new.mp4', outputVideoFilePath).catch(console.error)
// 	} catch (error) {
// 		console.log('Error in createShortScript: ', error)
// 	}
// }


const generateQuoraShort = async (language: string, question:string,answer:string,quoraDetails:{
	name:string,
	upvote:string,
	comment:string,
	share:string,
}) => {
	try {
		const startTime = performance.now()
		
		await createQuoraImages(question,quoraDetails.upvote,quoraDetails.comment,quoraDetails.share,quoraTemplatePath,quoraDetails.name)

		
		const script = answer

		const finalScript = await summarizeShortScript({ script })


		// Creating voice for answer
		await createAudio({  script: finalScript, language, outputFilePath: answerAudioFilePath })


		//  Creating voice for question
		await createAudio({ script: question, language, outputFilePath: questionAudioFilePath ,voice:"IKne3meq5aSn9XLyUdCD"})

		// console.log('AUDIO GENERATED SUCCESSFULLY', 'basicaudio.mp3')


		await mergeTwoAudios({ questionAudio: questionAudioFilePath.replace('mp3','wav'), answerAudio: answerAudioFilePath.replace('mp3','wav') ,finalOutput:quoraAudioFilePath})



		
		
		
		const currentDir = process.cwd()

		await whisper(quoraAudioFilePath.replace('mp3','wav'))

		process.chdir(currentDir)
		// // return

		// console.log('MERGING AUDIO AND VIDEO')

		await processVTTFile(subTitlesFilePath)

		await mergeAudio({
			videoFilePath,
			audioFilePath: quoraAudioFilePath.replace('mp3','wav'),
			outputVideoPath: outputVideoFilePath,
			subtitlePath:subTitlesFilePath
		})

		await centerImage({
			path: quoraTemplatePath,
			videoPath: outputVideoFilePath,
		})

		// return

		// const queries: any = await getImageQuerys(
		// 	'/Users/chetan/Developer/code/short-video-automation/basicaudio.wav.vtt'
		// )

		// if (!queries) throw new Error('Queries not generated')

		// console.log('QUERIES: ', typeof queries)

		// await downloadImages(Object.values(queries))

		// await imageProccessing({
		// 	language: '',
		// 	queries: queries,
		// })

		const endTime = performance.now()

		// Calculate the elapsed time in seconds
		const elapsedTimeInSeconds = (endTime - startTime) / 1000

		console.log(`Function took ${elapsedTimeInSeconds} seconds to finish.`)

		
	} catch (error) {
		console.log('Error in createShortScript: ', error)
	}
}

generateQuoraShort(
	'en-IN',
	`Why do software developers age over 40 leave the industry?`,
	`
	I’ll give you my reasons, although I left it until my mid-fifties to quit (maybe temporarily) commercial software development.

	Because I can. I don’t maintain an expensive lifestyle and I’ve earned enough to retire early.
	I have lots of other things that I’m interested in that I’d like to pursue.
	Company politics increasingly seem to intrude on the job, to the extent that it’s like wading through sludge.
	Too many managers with little or no experience in the sector, who only seem interested in bringing in a large number of cheap but relatively incompetent staff and cranking out any old rubbish, rather than focusing on quality.
	Diminishing returns to the point where even solving technical problems is not really fun any more. In the areas that I work in, the rate of technical change has slowed considerably compared to even ten years ago.
	The new, interesting stuff like ML is such a paradigm shift that you can’t learn it on the job. Hence I’ve retreated back into academia.
	Note that this is the opposite of some of the assertions that older developers “aren’t very good and can’t keep up”. Granted there’ll be a few people like that, but most of my peers seem to be feeling the same as I do.
	`,
	{
		comment:"1",
		upvote:"17",
		share:"1",
		name:"Martin Ingram"
	}
)

