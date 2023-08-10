import { OpenAI } from 'langchain/llms/openai'
import { PromptTemplate } from 'langchain/prompts'

import { LLMChain } from 'langchain/chains'

import { createScriptTemplate, temp } from './promptTemplates/templates'

export const createShortScript = async ({ language, topic }: { language: string; topic: string }) => {
	try {
		console.log('Creating Script...')

		const model = new OpenAI({
			openAIApiKey: process.env.OPENAI_API,
			temperature: 0.7,
			modelName: 'gpt-3.5-turbo-0301',
		})

		const prompt = PromptTemplate.fromTemplate(temp)

		// console.log('Prompt: ', prompt)

		const chain = new LLMChain({ llm: model, prompt })

		const res = await chain.call({ language, topic })

		if (!JSON.parse(res.text).script) throw new Error('Error in Script not generated')

		console.log('Script: ', JSON.parse(res.text))

		return JSON.parse(res.text).script
	} catch (error) {
		console.log('Error in createShortScript: ', error)
	}
}

// import { Configuration, OpenAIApi } from 'openai'

// const configuration = new Configuration({
// 	apiKey: process.env.OPENAI_API,
// })
// const openai = new OpenAIApi(configuration)

// export const createShortScript = async ({ language, topic }: { language: string; topic: string }) => {
// 	const chatCompletion = await openai.createChatCompletion({
// 		model: 'gpt-3.5-turbo',
// 		messages: [{ role: 'system', content: createScriptTemplate(language, topic) }],
// 	})
// 	// console.log('chatCompletion: ', chatCompletion.data.choices[0].message)

// 	if (!JSON.parse(chatCompletion.data.choices[0].message?.content!)?.script)
// 		throw new Error('Error in Script not generated')

// 	return JSON.parse(chatCompletion.data.choices[0].message?.content!)?.script
// }
