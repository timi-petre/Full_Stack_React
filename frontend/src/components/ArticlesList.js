import React from 'react'
import { Link } from 'react-router-dom'

export default function ArticlesList({ articles }) {
	return (
		<>
			{articles.map(article => (
				<Link
					className="article-list-item"
					to={`/articles/${article.name}`}
					key={article.name}
				>
					<h3>{article.title}</h3>
					<p>{article.content[0].substring(0, 148)}...</p>
				</Link>
			))}
		</>
	)
}
