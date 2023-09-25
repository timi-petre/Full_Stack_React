import axios from 'axios'
import React, { useState } from 'react'
import useUser from '../hooks/useUser'

const AddCommentForm = ({ articleName, onArticleUpdated }) => {
	const [name, setName] = useState('')
	const [commentText, setCommentText] = useState('')
	const { user } = useUser()

	const addComment = async () => {
		const token = user && (await user.getIdToken())
		const headers = token ? { authtoken: token } : {}
		const response = await axios.post(
			`/api/articles/${articleName}/comments`,
			{
				postedBy: name,
				text: commentText,
			},
			{ headers },
		)
		const updatedArticle = response.data
		onArticleUpdated(updatedArticle)
		setName('')
		setCommentText('')
	}

	return (
		<div id="add-comment-form">
			<h3>Add a comment</h3>
			<p>You are posting as {user && user.email}</p>

			<textarea
				name="message"
				id="message"
				cols="50"
				rows="4"
				value={commentText}
				onChange={e => {
					setCommentText(e.target.value)
				}}
			></textarea>

			<button onClick={() => addComment()}>Add comment</button>
		</div>
	)
}

export default AddCommentForm
