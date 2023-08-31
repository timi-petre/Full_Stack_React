import React from 'react'
import { useParams } from 'react-router-dom'
import NotFoundPage from './NotFoundPage'
import articles from './article-content'

//* localhost:3000/articles/learn-node
export default function ArticlePage() {
	const params = useParams()
	const articleId = params.articleId
	const article = articles.find(article => article.name === articleId)

	if (!article) {
		return <NotFoundPage />
	}

	return (
		<>
			<h1>{article.title}</h1>
			{article.content.map((paragraph, index) => (
				<p key={index}>{paragraph}</p>
			))}
		</>
	)
}
