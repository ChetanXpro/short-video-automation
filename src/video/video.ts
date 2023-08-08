import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import path from 'path'

export const mergeAudio = async ({
	videoFilePath,
	audioFilePath,
	outputVideoPath,
}: {
	videoFilePath: string
	audioFilePath: string
	outputVideoPath: string
}) => {
	const videodata: any = await new Promise((resolve, reject) => {
		ffmpeg.ffprobe(videoFilePath, (err, videoMetadata) => {
			if (err) {
				console.error('Error getting video duration:', err.message)
				reject(err)
			}
			resolve(videoMetadata)
		})
	})

	const audiodata: any = await new Promise((resolve, reject) => {
		ffmpeg.ffprobe(audioFilePath, (err, audioMetadata) => {
			if (err) {
				console.error('Error getting audio duration:', err.message)
				reject(err)
			}
			resolve(audioMetadata)
		})
	})

	// console.log('videodata: ', videodata)
	// console.log('audiodata: ', audiodata)

	const videoDurationInSeconds = videodata.format.duration

	const audioDurationInSeconds = audiodata.format.duration

	// Calculate how many times the audio needs to be repeated to match the video duration
	const trimDuration = Math.min(videoDurationInSeconds!, audioDurationInSeconds!)
	const audioSpeed = 1
	const targetWidth = 1080
	const targetHeight = 1920
	const adjustedTrimDuration = trimDuration / audioSpeed
	const videoFilter = `scale=${targetWidth}:-1,pad=${targetWidth}:${targetHeight}:(ow-iw)/2:(oh-ih)/2:black`
	const audioFilter = `atempo=${audioSpeed},aformat=sample_rates=44100:channel_layouts=stereo`
	const srtFilePath = 'basicaudio.wav.srt'
	const newSrtFilePath = path.join(__dirname, '..', '..', srtFilePath)

	// Merge the audio with the video
	ffmpeg(videoFilePath)
		.inputOptions(`-t ${adjustedTrimDuration}`)
		.input(audioFilePath)

		.videoFilter(videoFilter)
		.audioFilter(audioFilter)
		.outputOptions(['-vf', `subtitles=${newSrtFilePath}`, '-map', '0:v', '-map', '1:a', '-c:v libx264', '-c:a aac'])
		.output(outputVideoPath)
		.on('end', () => {
			console.log('Audio added to video complete!')
		})
		.on('error', err => {
			console.error('Error during audio adding to video:', err.message)
		})
		.run()
}
