import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import path from 'path'
import ffmpegPath from 'ffmpeg-static'
import ffmpegProb from 'ffprobe-static'
import { exec } from 'child_process'

if (ffmpegPath) {
	ffmpeg.setFfprobePath(ffmpegProb.path)
	ffmpeg.setFfmpegPath(ffmpegPath)
}

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
	// const backgroundMusicFilePath = path.join(__dirname, '..', '..', 'bg.mp3')

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
	const srtFilePath = 'basicaudio.wav.vtt'
	const newSrtFilePath = path.join(__dirname, '..', '..', srtFilePath)
	const backgroundMusicFilePath = path.join(__dirname, '..', '..', 'bg.mp3')

	const out = path.join(__dirname, '..', '..', 'tryyyyyyyyy.mp4')
	const subtitleStyle =
		"force_style='Alignment=6,FontName=Trebuchet,FontSize=18,PrimaryColour=&Hffffff&,OutlineColour=&H00000000&,MarginV=25'"

	const backgroundAudiocommand = `${ffmpegPath} -i ${outputVideoPath} -i ${backgroundMusicFilePath} -filter_complex "[0:a]volume=1[a1];[1:a]volume=0.4[b1];[a1][b1]amix=inputs=2[aout]" -map 0:v -map "[aout]" -c:v copy -c:a aac -shortest ${out}`

	return new Promise((resolve, reject) => {
		ffmpeg(videoFilePath)
			.inputOptions(`-t ${adjustedTrimDuration}`)
			.input(audioFilePath)

			.videoFilter(videoFilter)
			.audioFilter(audioFilter)
			.input(backgroundMusicFilePath)

			.outputOptions([
				'-map',
				'0:v',
				'-map',
				'1:a',
				'-c:v libx264',
				'-c:a aac',
				'-vf',
				`subtitles=${newSrtFilePath}:${subtitleStyle}`,
				// '-apad',
			])
			.output(outputVideoPath)
			.on('start', commandLine => {
				console.log('Spawned Ffmpeg with command: ' + commandLine)
			})
			.on('end', () => {
				console.log('Audio added to video complete!')

				exec(backgroundAudiocommand, (error, stdout, stderr) => {
					if (error) {
						console.error('Error:', error)
						reject(error)
					}
					resolve(stdout ? stdout : stderr)
				})
			})
			.on('error', err => {
				console.error('Error during audio adding to video:', err.message)
				reject(err)
			})
			.run()
	})
}
