import { BlobServiceClient } from '@azure/storage-blob'

import fs from 'fs'

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_URI

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING!)

export default async function uploadFile(containerName: string, blobName: string, filePath: string) {
	const containerClient = blobServiceClient.getContainerClient(containerName)
	const blockBlobClient = containerClient.getBlockBlobClient(blobName)

	const stream = fs.createReadStream(filePath)

	const cc = await blockBlobClient.uploadStream(stream, 4 * 1024 * 1024, 20, {
		blobHTTPHeaders: {
			blobContentType: 'application/octet-stream', // Adjust content type as needed
		},
	})

	console.log(cc)

	console.log('File uploaded successfully to azure')
}
