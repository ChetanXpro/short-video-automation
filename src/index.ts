import dotenv from 'dotenv'
dotenv.config()
import { createShortScript } from './audio/videoScript'
import { createAudio } from './audio/elevenAudio'

createShortScript({ language: 'english', topic: 'historical fact' })

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

generateYoutubeShort()
