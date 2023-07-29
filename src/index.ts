import dotenv from 'dotenv'
dotenv.config()
import { createShortScript } from './audio/videoScript'
import { createAudio } from './audio/elevenAudio'
import { convertToWav, whisper } from './transcript/transcribe'
import path from 'path'
import shell from 'shelljs'

// createShortScript({ language: 'english', topic: 'historical fact' })

const generateYoutubeShort = async () => {
	try {
		const script = await createShortScript({ language: 'english', topic: 'historical fact' })
		console.log('SCRIPT GENERATED: ', script)

		if (!script) throw new Error('Script not generated')

		await createAudio({ script, language: 'english' })

		console.log('AUDIO GENERATED SUCCESSFULLY', 'basicaudio.mp3')
	} catch (error) {
		console.log('Error in createShortScript: ', error)
	}
}

// generateYoutubeShort()
const inputFilePath = path.join(__dirname, '..', 'basicaudio.mp3')
// console.log(AUDIOPATH)
const outputFilePath = path.join(__dirname, '..', 'basicaudio.wav')
// convertToWav(inputFilePath, outputFilePath).then(e => {
// 	console.log(e)
// })
whisper(outputFilePath)
