import axios from 'axios'
import fs from 'fs-extra'
import ffmpeg from 'fluent-ffmpeg'
const ELEVEN_LAB_API = process.env.ELEVEN_LAB_API

if (!ELEVEN_LAB_API) throw new Error('ELEVEN_LAB_API not found')
const elevenLabsAPI = 'https://api.elevenlabs.io/v1'
export const createAudio = async ({
	script,
	language,
	stabilityValue = 0.2,
	similarityBoostValue = 0.1,
	voice = 'VR6AewLTigWG4xSOukaG',
	outputFilePath = 'basicaudio.mp3',
}: {
	script: string
	language: string
	stabilityValue?: number
	similarityBoostValue?: number
	voice?: string
	outputFilePath?: string
}) => {
	try {
		const voiceURL = `${elevenLabsAPI}/text-to-speech/${voice}`

		const response = await axios({
			method: 'POST',
			url: voiceURL,
			data: {
				text: script,
				voice_settings: {
					stability: stabilityValue,
					similarity_boost: similarityBoostValue,
				},
				model_id: 'eleven_monolingual_v1',
			},
			headers: {
				Accept: 'audio/mpeg',
				'xi-api-key': ELEVEN_LAB_API,
				'Content-Type': 'application/json',
			},
			responseType: 'stream',
		})

		const writeStream = fs.createWriteStream(outputFilePath)
		response.data.pipe(writeStream)

		return new Promise(resolve => {
			writeStream.on('finish', () => {
				console.log('Audio file created')
				resolve('Audio file created')
			})
		})
	} catch (error) {
		console.log('Error in createAudio: ', error)
	}
}

export const convertToWav = async (inputFilePath: string, outputFilePath: string) => {
	console.log(inputFilePath, outputFilePath)
	if (!inputFilePath || !outputFilePath) throw new Error('Input or output file path not provided')
	console.log('Converting audio to wav')
	return new Promise((resolve, reject) => {
		// ...
		ffmpeg(inputFilePath)
			.toFormat('wav')
			.audioFrequency(16000)
			.output(outputFilePath)
			.on('end', () => {
				console.log('Audio converted to wav')
				resolve('Conversion completed successfully')
			})
			.on('error', err => {
				console.error('Error converting the file:', err.message)
				reject(err)
			})
			.run()
	})
}
