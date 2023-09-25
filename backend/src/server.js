import 'dotenv/config'
import express from 'express'
import admin from 'firebase-admin'
import fs from 'fs'
import path from 'path'
import { connectToDb, db } from './db.js'

import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const credentials = JSON.parse(fs.readFileSync('./credentials.json'))
admin.initializeApp({
	credential: admin.credential.cert(credentials),
})

const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, '../build')))

app.get(/^(?!\/api).+/, (req, res) => {
	res.sendFile(path.join(__dirname, '../build/index.html'))
})

app.use(async (req, res, next) => {
	const { authtoken } = req.headers

	if (authtoken) {
		try {
			const user = await admin.auth().verifyIdToken(authtoken)
			req.user = user
		} catch (error) {
			return res.sendStatus(400)
		}
	}
	req.user = req.user || {}
	next()
})

app.get('/api/articles/:name', async (req, res) => {
	const { name } = req.params
	const { uid } = req.user

	const article = await db.collection('articles').findOne({ name })

	if (article) {
		const upvoteIds = article.upvoteIds || []
		article.canUpvote = uid && !upvoteIds.includes(uid)
		res.json(article)
	} else {
		res.sendStatus(404)
	}
})

app.use((req, res, next) => {
	if (req.user) {
		next()
	} else {
		res.sendStatus(401)
	}
})

app.put('/api/articles/:name/upvote', async (req, res) => {
	const { name } = req.params
	const { uid } = req.user
	// const article = articlesInfo.find(a => a.name === name)

	const article = await db.collection('articles').findOne({ name })

	if (article) {
		// article.upvotes += 1
		const upvoteIds = article.upvoteIds || []
		const canUpvote = uid && !upvoteIds.includes(uid)
		if (canUpvote) {
			await db.collection('articles').updateOne(
				{ name },
				{
					$inc: { upvotes: 1 },
					$push: { upvoteIds: uid },
				},
			)
		}

		const updatedArticle = await db.collection('articles').findOne({ name })

		res.json(updatedArticle)
	} else {
		res.send("That article doesn't exists")
	}
})

app.post('/api/articles/:name/comments', async (req, res) => {
	const { name } = req.params
	const { text } = req.body
	const { email } = req.user

	// const article = articlesInfo.find(a => a.name === name)

	await db.collection('articles').updateOne(
		{ name },
		{
			$push: { comments: { postedBy: email, text } },
		},
	)
	const article = await db.collection('articles').findOne({ name })

	if (article) {
		// article.comments.push({ postedBy, text })
		// res.send(article.comments)
		res.json(article)
	} else {
		res.send("That article does't exists")
	}
})

const PORT = process.env.PORT || 8000

connectToDb(() => {
	console.log('Succesfully connected to database')
	app.listen(PORT, () => {
		console.log('Server is running on port ' + PORT)
	})
})

// app.post('/hello', (req, res) => {
// 	res.send(`Hello ${req.body.name}`)
// })

// app.get('/hello/:name', (req, res) => {
// 	const name = req.params.name
// 	res.send(`Hello ${name}`)
// })

// let articlesInfo = [
// 	{
// 		name: 'learn-react',
// 		upvotes: 0,
// 		comments: [],
// 	},
// 	{
// 		name: 'learn-node',
// 		upvotes: 0,
// 		comments: [],
// 	},
// 	{
// 		name: 'mongodb',
// 		upvotes: 0,
// 		comments: [],
// 	},
// ]
