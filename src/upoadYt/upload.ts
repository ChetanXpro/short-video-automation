// const fs = require('fs')
import fs from 'fs'
import readline from 'readline'

import assert from 'assert'
import { google } from 'googleapis'
import path from 'path'

const OAuth2 = google.auth.OAuth2

// video category IDs for YouTube:
const categoryIds = {
	Entertainment: '24',
	Education: '27',
	ScienceTechnology: '28',
}

// If modifying these scopes, delete your previously saved credentials in client_oauth_token.json
const SCOPES = ['https://www.googleapis.com/auth/youtube.upload']
const TOKEN_PATH = path.join(__dirname, 'token.json')
const CLIENT_CRED = path.join(__dirname, 'cred.json')

// const thumbFilePath = "../thumb.png";

export const uploadVideos = (title: string, description: string, tags: string[], videoPath: string) => {
	assert(fs.existsSync(videoPath))
	//   assert(fs.existsSync(thumbFilePath));

	// Load client secrets from a local file.
	fs.readFile(CLIENT_CRED, function processClientSecrets(err, content: any) {
		if (err) {
			console.log('Error loading client secret file: ' + err)
			return
		}
		// Authorize a client with the loaded credentials, then call the YouTube API.
		authorize(JSON.parse(content), (auth: any) => uploadVideo(auth, title, description, tags, videoPath))
	})
}

/**
 * Upload the video file.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function uploadVideo(auth: any, title: string, description: string, tags: any, videoPath: string) {
	const service = google.youtube('v3')

	service.videos.insert(
		{
			auth: auth,
			part: ['snippet,status'],
			requestBody: {
				snippet: {
					title,
					description,
					tags,
					categoryId: categoryIds.ScienceTechnology,

					defaultLanguage: 'en',
					defaultAudioLanguage: 'en',
				},

				status: {
					privacyStatus: 'public',
					madeForKids: false,
				},
			},
			media: {
				body: fs.createReadStream(videoPath),
			},
		},
		function (err: any, response: any) {
			if (err) {
				console.log('The API returned an error: ' + err)
				return
			}
			console.log(response.data)

			return response.data
		}
	)
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials: any, callback: any) {
	const clientSecret = credentials.web.client_secret
	const clientId = credentials.web.client_id
	const redirectUrl = credentials.web.redirect_uris[0]

	console.log(clientSecret, clientId, redirectUrl)

	const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl)

	// Check if we have previously stored a token.
	fs.readFile(TOKEN_PATH, function (err, token: any) {
		if (err) {
			getNewToken(oauth2Client, callback)
		} else {
			oauth2Client.credentials = JSON.parse(token)
			callback(oauth2Client)
		}
	})
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client: any, callback: any) {
	const authUrl = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES,
	})
	console.log('Authorize this app by visiting this url: ', authUrl)
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	})
	rl.question('Enter the code from that page here: ', function (code) {
		rl.close()
		oauth2Client.getToken(code, function (err: any, token: any) {
			if (err) {
				console.log('Error while trying to retrieve access token', err)
				return
			}
			oauth2Client.credentials = token
			storeToken(token)
			callback(oauth2Client)
		})
	})
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token: any) {
	fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
		if (err) throw err
		console.log('Token stored to ' + TOKEN_PATH)
	})
}

// getNewToken(oauth2Client, (auth) => {
//   console.log(auth);

// });
