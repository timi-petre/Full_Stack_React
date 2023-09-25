import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AddCommentForm from '../components/AddCommentForm'
import CommentsList from '../components/CommentsList'
import useUser from '../hooks/useUser'
import NotFoundPage from './NotFoundPage'
import articles from './article-content'

//* localhost:3000/articles/learn-node
export default function ArticlePage() {
	const [articleInfo, setArticleInfo] = useState({
		upvotes: 0,
		comments: [],
		canUpvote: false,
	})
	const { canUpvote } = articleInfo
	const { articleId } = useParams()

	const { user, isLoading } = useUser()
	useEffect(() => {
		async function loadArticleInfo() {
			const token = user && (await user.getIdToken())
			const headers = token ? { authtoken: token } : {}
			const response = await axios.get(`/api/articles/${articleId}`, {
				headers,
			})
			const newArticleInfo = response.data
			setArticleInfo(newArticleInfo)
		}

		if (!isLoading) {
			loadArticleInfo()
		}
	}, [isLoading, user])

	const article = articles.find(article => article.name === articleId)

	const addUpvote = async () => {
		const token = user && (await user.getIdToken())
		const headers = token ? { authtoken: token } : {}
		const response = await axios.put(`/api/articles/${articleId}/upvote`, null, {
			headers,
		})
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
				{user ? (
					<button onClick={addUpvote}>{canUpvote ? 'Upvote' : 'Already Upvoted'}</button>
				) : (
					<button>Log in to upvote</button>
				)}
			</div>
			<p>This article has {articleInfo.upvotes} upvote(s)</p>
			{article.content.map((paragraph, index) => (
				<p key={index}>{paragraph}</p>
			))}
			{user ? (
				<AddCommentForm
					articleName={articleId}
					onArticleUpdated={updatedArticle => setArticleInfo(updatedArticle)}
				/>
			) : (
				<button>Log in to add a comment</button>
			)}
			<CommentsList comments={articleInfo.comments} />
		</>
	)
}
