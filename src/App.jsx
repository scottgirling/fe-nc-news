import { Routes, Route } from 'react-router-dom';
import './App.css'
import { Header } from './components/Header';
import { NavBar } from './components/NavBar';
import { PostArticle } from './components/PostArticle';
import { ArticleList } from './components/ArticleList';
import { SingleArticle } from './components/SingleArticle';
import { UserLoginForm } from './components/UserLoginForm';
import { UserAccountProvider } from './contexts/UserAccount';
import { ErrorPage } from './components/ErrorPage';
import { Footer } from './components/Footer';

function App() {

  return (
    <UserAccountProvider>
      <Header />
      <NavBar />
      <PostArticle />
      
      <Routes>
        <Route path="/" element={<ArticleList/>} />
        <Route path="/articles/:article_id" element={<SingleArticle />} />
        <Route path="/search/:topic" element={<ArticleList />} />
        <Route path="/login" element={<UserLoginForm/>} />
        <Route path="*" element={<ErrorPage/>} />
      </Routes>

      <Footer />
    </UserAccountProvider>
  )
}

export default App;
