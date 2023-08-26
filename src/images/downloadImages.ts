import axios from 'axios'
import fs from 'fs'
export const downloadImages = async (queries: any) => {
	const downloadPromises = queries.map(async (query: any) => {
		const { data } = await axios.get(`https://api.unsplash.com/search/photos?query=${query}&page=1`, {
			headers: {
				Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
			},
		})

		const url = data.results[0].urls.thumb
		const response = await axios.get(url, {
			responseType: 'stream',
		})

		const fileName = `${query.split(' ').join('')}.jpg`
		const writeStream = fs.createWriteStream(fileName)

		response.data.pipe(writeStream)

		return new Promise((resolve, reject) => {
			writeStream.on('finish', resolve)
			writeStream.on('error', reject)
		})
	})

	try {
		// Wait for all promises to resolve
		await Promise.all(downloadPromises)
		console.log('All images downloaded successfully.')
	} catch (error) {
		console.error('Error downloading images:', error)
	}
}
