import path from 'path'
import { nodewhisper } from 'nodejs-whisper'

export const whisper = async (filePath: string, options?: any) => {
	try {
		const transcript = await nodewhisper(filePath, {
			modelName: 'tiny.en',
			autoDownloadModelName: 'tiny.en',
			whisperOptions: {
				outputInSrt: true, // get output result in srt file

				timestamps_length: 10, // amount of dialogue per timestamp pair
				splitOnWord: true, //split on word rather than on token
			},
		})

		return transcript
	} catch (error) {
		console.log('Error in whisper: ', error)
	}
}
