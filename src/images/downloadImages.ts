import axios from 'axios'
import fs from 'fs'
export const downloadImages = async (queries: any) => {
	for (const query of queries) {
		const name = query.timestamp.split('->')[0].trim()
		const { data } = await axios.get(`https://api.unsplash.com/search/photos?query=${query.Query}&page=1`, {
			headers: {
				Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
			},
		})
		const url = data.results[0].urls.thumb
		const response = await axios.get(url, {
			responseType: 'stream',
		})
		await response.data.pipe(fs.createWriteStream(`${name}.jpg`))
	}
}
