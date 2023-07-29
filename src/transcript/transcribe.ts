import path from 'path'
import shell from 'shelljs'
import ffmpeg from 'fluent-ffmpeg'
const WHISPER_CPP_PATH = path.join(__dirname, 'whisper.cpp')
const WHISPER_CPP_MAIN_PATH = './main'
const AUDIOPATHMP3 = path.join(__dirname, '..', 'basicaudio.mp3')
const AUDIOPATHWAV = path.join(__dirname, '..', 'basicaudio.wav')
export const whisper = async (filePath: string, options?: any) => {
	try {
		console.log('Transcribing', filePath)

		const defaultCommand = `./main -osrt -ml 10 -m ./models/ggml-tiny.en.bin -f ${filePath}`

		await runMakeCommand()

		new Promise(async (resolve, reject) => {
			try {
				// docs: https://github.com/shelljs/shelljs#execcommand--options--callback
				shell.exec(defaultCommand, options, (code: number, stdout: string, stderr: string) => {
					if (code === 0) {
						resolve(stdout)
						console.log('Transcription complete')
					} else {
						reject(stderr)
						console.log('Transcription failed')
					}
				})
			} catch (error) {
				reject(error)
				console.log('Transcription failed')
			}
			// })
		})
	} catch (error) {
		console.log('Error in whisper: ', error)
	}
}

const defaultShellOptions = {
	silent: true, // true: won't print to console
	async: false,
}
const runMakeCommand = async () => {
	try {
		shell.cd(WHISPER_CPP_PATH)

		if (!shell.which(WHISPER_CPP_MAIN_PATH)) {
			console.log('Main file not found')
			console.log('Running make command')

			shell.exec('make', defaultShellOptions)

			if (!shell.which(WHISPER_CPP_MAIN_PATH)) {
				console.log('Make command failed')
				process.exit(1)
			}
			console.log('Make command successfully executed')
		} else {
			console.log('Main file found, no need to run MAKE command')
		}
	} catch (error) {
		console.error('Error in make command', error)
		process.exit(1)
	}
}

export const convertToWav = async (inputFilePath: string, outputFilePath: string) => {
	console.log(inputFilePath, outputFilePath)
	if (!inputFilePath || !outputFilePath) throw new Error('Input or output file path not provided')

	try {
		ffmpeg(inputFilePath)
			.toFormat('wav')
			.audioFrequency(16000)
			.output(outputFilePath)
			.on('end', () => {
				console.log('Conversion completed successfully')
				// resolve('Conversion completed successfully')
			})
			.on('error', err => {
				console.error('Error converting the file:', err.message)
				// reject('Error converting the file:')
			})
			.run()
	} catch (error) {
		console.error('Error converting the file:', error)
		// reject('Error converting the file:')
	}
}
