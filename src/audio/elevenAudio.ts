import axios from 'axios'
import fs from 'fs-extra'
const ELEVEN_LAB_API = process.env.ELEVEN_LAB_API

console.log('ELEVEN_LAB_API: ', ELEVEN_LAB_API)

if (!ELEVEN_LAB_API) throw new Error('ELEVEN_LAB_API not found')
const elevenLabsAPI = 'https://api.elevenlabs.io/v1'
export const createAudio = async ({
	script,
	language,
	stabilityValue = 0.2,
	similarityBoostValue = 0.1,
	voice = 'VR6AewLTigWG4xSOukaG',
}: {
	script: string
	language: string
	stabilityValue?: number
	similarityBoostValue?: number
	voice?: string
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

		await response.data.pipe(fs.createWriteStream('basicaudio.mp3'))
	} catch (error) {
		console.log('Error in createAudio: ', error)
	}
}
