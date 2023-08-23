import dotenv from 'dotenv'
dotenv.config()
import { createShortScript } from './videoScript'
import { convertToWav, createAudio } from './audio/elevenAudio'
import { whisper } from './transcript/transcribe'

import express from 'express'
const app = express()
import path from 'path'

import { mergeAudio } from './video/video'

import { uploadVideos } from './upoad/upload'
import uploadFile from './upoad/azureUpload'
import { imageProccessing } from './images/imagesProccessing'
import { downloadImages } from './images/downloadImages'
import { getImageQuerys } from './Editing/getImageQuerys'
const inputFilePath = path.join(__dirname, '..', 'basicaudio.mp3')

const outputFilePath = path.join(__dirname, '..', 'basicaudio.wav')

const videoFilePath = path.join(__dirname, '..', 'new.mp4')

const outputVideoFilePath = path.join(__dirname, '..', 'shorts', 'ytshort.mp4')

const generateYoutubeShort = async (language: string, topic: string) => {
	try {
		// const script = await createShortScript({ language: language, topic: topic })

		// console.log('SCRIPT GENERATED: ', script)

		// if (!script) throw new Error('Script not generated')

		// await createAudio({ script, language, outputFilePath: inputFilePath })

		// console.log('AUDIO GENERATED SUCCESSFULLY', 'basicaudio.mp3')

		// await convertToWav(inputFilePath, outputFilePath)

		// await whisper(outputFilePath)

		// console.log('MERGING AUDIO AND VIDEO')

		// await mergeAudio({
		// 	videoFilePath,
		// 	audioFilePath: outputFilePath,
		// 	outputVideoPath: outputVideoFilePath,
		// })

		const queries: any = await getImageQuerys()

		// if (!queries) throw new Error('Queries not generated')

		console.log('QUERIES: ', queries)

		// console.log('rr: ', Object.values(queries))

		await downloadImages(Object.values(queries))

		await imageProccessing({ language: '', queries })

		return
		// uploadVideos('facts', 'facts', ['#facts', '#trending', '#shorts'], outputVideoFilePath)
		uploadFile('videos', Math.random() + 'new.mp4', outputVideoFilePath).catch(console.error)
	} catch (error) {
		console.log('Error in createShortScript: ', error)
	}
}

// const containerName = 'videos'
// const blobName = 'new.mp4'
// const filePath = '/home/chetan/code/ts-content-gpt/new.mp4'

// uploadFile(containerName, blobName, filePath).catch(console.error)

// app.use(express.json())

generateYoutubeShort('english', 'indian fact')

const queries = [
	{ Query: 'Great Wall of China', timestamp: '1 -> 3' },
	{ Query: 'Chinese Empire', timestamp: '11 -> 12' },
	// { Query: 'Ming Dynasty', timestamp: '7 -> 8' },
	// { Query: 'Chinese Empire', timestamp: '11 -> 12' },
	// { Query: 'brick, tamperth, and stone', timestamp: '17 -> 18' },
]

// mergeAudio({
// 	videoFilePath,
// 	audioFilePath: outputFilePath,
// 	outputVideoPath: outputVideoFilePath,
// })

// imageProccessing({ language: '', queries })

// downloadImages(queries)

// app.post('/generate', async (req, res) => {
// 	try {
// 		const { language, topic } = req.body
// 		if (!language || !topic) return res.status(500).send('Provide language and topic')
// 		const startTime: number = new Date().getTime()

// 		await generateYoutubeShort('english', 'indian fact')

// 		const endTime: number = new Date().getTime()
// 		const executionTimeMilliseconds = endTime - startTime

// 		const executionTimeSeconds = executionTimeMilliseconds / 1000

// 		console.log(`Function execution time: ${executionTimeSeconds.toFixed(2)} seconds`)
// 		res.status(200).json({ status: `Function execution time: ${executionTimeSeconds.toFixed(2)} seconds` })
// 	} catch (error) {
// 		console.log('Error in /generate: ', error)
// 		res.status(500).send('Error in /generate')
// 	}
// })

// app.listen(3000, () => {
// 	console.log('Server running on port 3000')
// })
