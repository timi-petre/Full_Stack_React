import express from 'express'
import { connectToDb, db } from './db.js'

const app = express()
app.use(express.json())

app.get('/api/articles/:name', async (req, res) => {
	const { name } = req.params

	const article = await db.collection('articles').findOne({ name })

	if (article) {
		res.json(article)
	} else {
		res.sendStatus(404)
	}
})

app.put('/api/articles/:name/upvote', async (req, res) => {
	const { name } = req.params
	// const article = articlesInfo.find(a => a.name === name)

	await db.collection('articles').updateOne(
		{ name },
		{
			$inc: { upvotes: 1 },
		},
	)
	const article = await db.collection('articles').findOne({ name })

	if (article) {
		// article.upvotes += 1
		res.send(`The ${name} article now has ${article.upvotes} upvotes`)
	} else {
		res.send("That article does't exists")
	}
})

app.post('/api/articles/:name/comments', async (req, res) => {
	const { name } = req.params
	const { postedBy, text } = req.body

	// const article = articlesInfo.find(a => a.name === name)

	await db.collection('articles').updateOne(
		{ name },
		{
			$push: { comments: { postedBy, text } },
		},
	)
	const article = await db.collection('articles').findOne({ name })

	if (article) {
		// article.comments.push({ postedBy, text })
		res.send(article.comments)
	} else {
		res.send("That article does't exists")
	}
})

connectToDb(() => {
	console.log('Succesfully connected to database')
	app.listen(8000, () => {
		console.log('Server is running on port 8000')
	})
})

// app.post('/hello', (req, res) => {
// 	res.send(`Hello ${req.body.name}`)
// })

// app.get('/hello/:name', (req, res) => {
// 	const name = req.params.name
// 	res.send(`Hello ${name}`)
// })
