import axios from 'axios'
import fs from 'fs'
export const downloadImages = async (queries: any) => {
	const PEXEL_BASE = `https://api.pexels.com/v1/`
	const downloadPromises = queries.map(async (query: any) => {
		const { data } = await axios.get(`${PEXEL_BASE}search?query=${query}&per_page=1`, {
			headers: {
				Authorization: `${process.env.PEXEL_API}`,
			},
		})

		// console.log('DATA: ', data)

		const url = data.photos[0].src.small

		const newHeight = 200

		// Use string.replace() to replace the height value
		const modifiedUrl = url.replace(/h=\d+/, `h=${newHeight}`)
		const response = await axios.get(modifiedUrl, {
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
		return await Promise.all(downloadPromises)
	} catch (error) {
		console.error('Error downloading images:', error)
	}
}
