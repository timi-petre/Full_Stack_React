import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import reportWebVitals from './reportWebVitals'

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyDKEkSjVMV0lUZkgCWov2IbOYPe-8HNOdw',
	authDomain: 'my-react-blog-39ff5.firebaseapp.com',
	projectId: 'my-react-blog-39ff5',
	storageBucket: 'my-react-blog-39ff5.appspot.com',
	messagingSenderId: '661776770890',
	appId: '1:661776770890:web:1a0f7415842b84ce88c3b3',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
