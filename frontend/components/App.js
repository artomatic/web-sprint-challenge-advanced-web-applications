import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import { axiosWithAuth } from '../axios'

import axios from 'axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState(0)
  const [spinnerOn, setSpinnerOn] = useState(false)

  const navigate = useNavigate()
  const redirectToLogin = () => navigate('/')
  const redirectToArticles = () => navigate('/articles')

  const logout = () => {
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
      setMessage('Goodbye!');
    }
    redirectToLogin();
  }

  const login = (username, password) => {
    const payload = {username, password};
    setMessage('');
    setSpinnerOn(true);
    axios.post(loginUrl ,payload)
      .then (res => {
        console.log(res);
        localStorage.setItem('token', res.data.token)
        setMessage(res.data.message);
        setSpinnerOn(false)
        redirectToArticles();
      })
      .catch(err => {
        console.log(err)
      })
  }

  const getArticles = () => {
    setMessage('');
    setSpinnerOn(true);
    axiosWithAuth().get(articlesUrl)
      .then (res => {
        console.log(res)
        setMessage(res.data.message);
        setArticles(res.data.articles);
        setSpinnerOn(false)
      })
      .catch (error => {
        console.log(error)
        error.status === 401? redirectToLogin() : {};
        setSpinnerOn(false)
      })
  }

  const postArticle = article => {
    setSpinnerOn(true);
    axiosWithAuth().post(articlesUrl, article)
      .then (res => {
        console.log(res);
        setMessage(res.data.message);
        setArticles([...articles, res.data.article]);
        setSpinnerOn(false);
      })
      .catch (error => {
        console.log(error);
        setSpinnerOn(false);
      })
  }

  const updateArticle = ( article_id, article) => {
    setSpinnerOn(true)
    axiosWithAuth().put(articlesUrl + '/' + article_id, article)
      .then (res => {
        console.log(res);
        setMessage(res.data.message);
        setArticles([...articles, res.data.article]);
        setSpinnerOn(false);
      })
      .catch (error => {
        console.log(error);
        setSpinnerOn(false);
      })
  }

  const deleteArticle = article_id => {
    setSpinnerOn(true);
    axiosWithAuth().delete(articlesUrl + '/' + article_id)
      .then (res => {
        console.log(res);
        setArticles(articles.filter(article => article.article_id !== article_id));
        setMessage(res.data.message);
        setSpinnerOn(false);
      })
      .catch (error => {
        console.log(error);
        setSpinnerOn(false);
      })
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm 
                currentArticleID={currentArticleId} 
                setCurrentArticleId={setCurrentArticleId}
                articles={articles}
                setArticles={setArticles}
                redirectToArticles={redirectToArticles}
                postArticle={postArticle}
                updateArticle={updateArticle}
              />
              <Articles 
                getArticles={getArticles} 
                articles={articles} 
                setCurrentArticleId={setCurrentArticleId}
                deleteArticle={deleteArticle}
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
