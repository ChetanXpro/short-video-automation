import ffmpeg from 'fluent-ffmpeg'

import path from 'path'

export const mergeAudio = async ({
	videoFilePath,
	audioFilePath,
	outputVideoPath,
	subtitlePath,
}: {
	videoFilePath: string
	audioFilePath: string
	outputVideoPath: string
	subtitlePath: string
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

	const videoDurationInSeconds = videodata.format.duration

	const audioDurationInSeconds = audiodata.format.duration

	// Calculate how many times the audio needs to be repeated to match the video duration
	const trimDuration = Math.min(videoDurationInSeconds!, audioDurationInSeconds!)
	const audioSpeed = 1

	const adjustedTrimDuration = trimDuration / audioSpeed

	const backgroundMusicFilePath = path.join(__dirname, '..', '..', 'bg.mp3')
	

	const tiktokFilterWithSubtitles =
		`scale=-1:1920:force_original_aspect_ratio=decrease,crop=1080:1920,subtitles=${subtitlePath}:force_style='Alignment=10,FontName=Trebuchet,FontSize=18,PrimaryColour=&Hffffff&,OutlineColour=&H00000000&,MarginV=25'`

	return new Promise((resolve, reject) => {
		// continue with the same part before

		ffmpeg()
			.input(videoFilePath)
			.inputOptions(`-t ${adjustedTrimDuration}`)
			.input(audioFilePath)
			.input(backgroundMusicFilePath)
			.videoFilter(tiktokFilterWithSubtitles)
			.complexFilter([
				{
					filter: 'volume',
					options: 1,
					inputs: '1:a',
					outputs: 'volumeAdjustedAudio',
				},
				{
					filter: 'volume',
					options: 0.1,
					inputs: '2:a',
					outputs: 'volumeAdjustedBGM',
				},
				{
					filter: 'amix',
					options: { inputs: 2, duration: 'shortest' },
					inputs: ['volumeAdjustedAudio', 'volumeAdjustedBGM'],
					outputs: 'amixed',
				},
			])
			.outputOptions(['-map', '0:v', '-map', '[amixed]', '-c:v libx264', '-c:a aac'])
			.output(outputVideoPath)
			.on('start', commandLine => {
				console.log('Spawned Ffmpeg with command: ' + commandLine)
			})
			.on('end', () => {
				console.log('Audio added to video complete!')
				resolve('done')
			})
			.on('error', err => {
				console.error('Error during audio adding to video:', err)
				reject(err)
			})
			.run()
	})
}
