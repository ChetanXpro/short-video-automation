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

const outputVideoFilePath = path.join(__dirname, '..', 'shorts', 'test.mp4')

const generateYoutubeShort = async (language: string, topic: string) => {
	try {
		const script = await createShortScript({ language: language, topic: topic })

		console.log('SCRIPT GENERATED: ', script)

		if (!script) throw new Error('Script not generated')

		await createAudio({ script, language, outputFilePath: inputFilePath })

		console.log('AUDIO GENERATED SUCCESSFULLY', 'basicaudio.mp3')

		await convertToWav(inputFilePath, outputFilePath)

		await whisper(outputFilePath)

		// return

		console.log('MERGING AUDIO AND VIDEO')

		await mergeAudio({
			videoFilePath,
			audioFilePath: outputFilePath,
			outputVideoPath: outputVideoFilePath,
		})

		// return

		const queries: any = await getImageQuerys()

		if (!queries) throw new Error('Queries not generated')

		// console.log('QUERIES: ', typeof queries)

		await downloadImages(Object.values(queries))

		await imageProccessing({
			language: '',
			queries: queries,
		})

		return
		// Upload to youtube
		uploadFile('videos', Math.random() + 'new.mp4', outputVideoFilePath).catch(console.error)
	} catch (error) {
		console.log('Error in createShortScript: ', error)
	}
}
