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
const inputFilePath = path.join(__dirname, '..', 'basicaudio.mp3')

const outputFilePath = path.join(__dirname, '..', 'basicaudio.wav')

const videoFilePath = path.join(__dirname, '..', 'new.mp4')

const outputVideoFilePath = path.join(__dirname, '..', 'shorts', 'ytshort.mp4')

const generateYoutubeShort = async (language: string, topic: string) => {
	try {
		const script = await createShortScript({ language: language, topic: topic })

		console.log('SCRIPT GENERATED: ', script)

		if (!script) throw new Error('Script not generated')

		await createAudio({ script, language, outputFilePath: inputFilePath })

		console.log('AUDIO GENERATED SUCCESSFULLY', 'basicaudio.mp3')

		await convertToWav(inputFilePath, outputFilePath)

		await whisper(outputFilePath)

		console.log('MERGING AUDIO AND VIDEO')

		await mergeAudio({
			videoFilePath,
			audioFilePath: outputFilePath,
			outputVideoPath: outputVideoFilePath,
		})
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

mergeAudio({
	videoFilePath,
	audioFilePath: outputFilePath,
	outputVideoPath: outputVideoFilePath,
})

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
