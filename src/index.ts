import dotenv from 'dotenv'
dotenv.config()
import { createShortScript } from './audio/videoScript'
import { convertToWav, createAudio } from './audio/elevenAudio'
import { whisper } from './transcript/transcribe'

import path from 'path'
import { mergeAudio } from './video/video'

const inputFilePath = path.join(__dirname, '..', 'basicaudio.mp3')

const outputFilePath = path.join(__dirname, '..', 'basicaudio.wav')

const videoFilePath = path.join(__dirname, '..', 'new.mp4')

const outputVideoFilePath = path.join(__dirname, '..', 'shorts', 'ytshort.mp4')

const generateYoutubeShort = async () => {
	try {
		const script = await createShortScript({ language: 'english', topic: 'world war fact' })
		console.log('SCRIPT GENERATED: ', script)

		if (!script) throw new Error('Script not generated')

		await createAudio({ script, language: 'english', outputFilePath: inputFilePath })

		console.log('AUDIO GENERATED SUCCESSFULLY', 'basicaudio.mp3')

		await convertToWav(inputFilePath, outputFilePath)

		await whisper(outputFilePath)

		console.log('MERGING AUDIO AND VIDEO')

		await mergeAudio({
			videoFilePath,
			audioFilePath: outputFilePath,
			outputVideoPath: outputVideoFilePath,
		})
	} catch (error) {
		console.log('Error in createShortScript: ', error)
	}
}

generateYoutubeShort()
