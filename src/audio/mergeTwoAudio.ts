import { OpenAI } from 'langchain/llms/openai'
import { PromptTemplate } from 'langchain/prompts'
import ffmpeg from 'fluent-ffmpeg'

import fs from 'fs'
import { exec } from 'child_process'
import { convertToWav } from './elevenAudio'



export const mergeTwoAudios = async ({ questionAudio, answerAudio ,finalOutput}: { questionAudio: string; answerAudio: string ,finalOutput:string}) => {
	

	const mainFilter = `ffmpeg -y -i ${questionAudio} -i ${answerAudio} -filter_complex "[0:a][1:a]concat=n=2:v=0:a=1" ${finalOutput}`
	console.log('merge two audio command : ', mainFilter)

	return new Promise((resolve,reject)=>{

		exec(mainFilter, (err, stdout, stderr) => {
			if (err) {
				console.error(err)
				// console.log('stderr: ', stderr)
				reject(err)
			}
			
			console.log('Video processing done')
	
	
			 convertToWav(finalOutput, finalOutput.replace('.mp3', '.wav')).then(() => {
						
							//file removed
							resolve('Audio file created and converted to wav')
					
						
					 })
	
		
		})

	})
	
}
