import { OpenAI } from 'langchain/llms/openai'
import { PromptTemplate } from 'langchain/prompts'

import { LLMChain } from 'langchain/chains'

import { createScriptTemplate } from '../promptTemplates/templates'

export const createShortScript = async ({ language, topic }: { language: string; topic: string }) => {
	try {
		const model = new OpenAI({
			openAIApiKey: process.env.OPENAI_API,
			temperature: 0.7,
			modelName: 'gpt-3.5-turbo-0301',
		})

		const prompt = PromptTemplate.fromTemplate(createScriptTemplate)

		const chain = new LLMChain({ llm: model, prompt })

		const res = await chain.call({ language, topic })

		if (!JSON.parse(res.text).script) throw new Error('Error in Script not generated')

		return JSON.parse(res.text).script
	} catch (error) {
		console.log('Error in createShortScript: ', error)
	}
}
