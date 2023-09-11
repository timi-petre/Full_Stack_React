import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import CommentsList from '../components/CommentsList'
import NotFoundPage from './NotFoundPage'
import articles from './article-content'

//* localhost:3000/articles/learn-node
export default function ArticlePage() {
	const [articleInfo, setArticleInfo] = useState({ upvotes: 0, comments: [] })
	const params = useParams()
	const articleId = params.articleId
	useEffect(() => {
		async function getData() {
			const response = await axios.get(`/api/articles/${articleId}`)
			const newArticleInfo = response.data
			setArticleInfo(newArticleInfo)
		}
		getData()
	}, [])

	const article = articles.find(article => article.name === articleId)

	const addUpvote = async () => {
		const response = await axios.put(`/api/articles/${articleId}/upvote`)
		const updatedArticle = response.data
		setArticleInfo(updatedArticle)
	}

	if (!article) {
		return <NotFoundPage />
	}

	return (
		<>
			<h1>{article.title}</h1>
			<div className="upvotes-section">
				<button onClick={addUpvote}>Upvote</button>
			</div>
			<p>This article has {articleInfo.upvotes} upvote(s)</p>
			{article.content.map((paragraph, index) => (
				<p key={index}>{paragraph}</p>
			))}
			<CommentsList comments={articleInfo.comments} />
		</>
	)
}
