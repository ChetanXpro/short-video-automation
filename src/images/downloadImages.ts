import axios from 'axios'
import fs from 'fs'
export const downloadImages = async (queries: any) => {
	queries.map(async (query: any) => {
		const { data } = await axios.get(`https://api.unsplash.com/search/photos?query=${query}&page=1`, {
			headers: {
				Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
			},
		})
		const url = data.results[0].urls.thumb
		const response = await axios.get(url, {
			responseType: 'stream',
		})
		await response.data.pipe(fs.createWriteStream(`${query}.jpg`))
	})
}
