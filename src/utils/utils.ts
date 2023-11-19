import fs from 'fs'

export const processVTTFile = (filePath: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, 'utf8', (err, data) => {
			if (err) {
				reject(err)
			} else {
				// Remove commas and periods using regular expressions
				const modifiedContent = data.replace(/[,\.]/g, '')
				resolve(modifiedContent)
			}
		})
	})
}
