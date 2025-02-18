import { Routes, Route } from 'react-router-dom';
import './App.css'
import { Header } from './components/Header';
import { NavBar } from './components/NavBar';
import { ArticleList } from './components/ArticleList';
import { SingleArticle } from './components/SingleArticle';

function App() {

  return (
    <>
      <Header />
      <NavBar />
      
      <Routes>
        <Route path="/" element={<ArticleList/>} />
        <Route path="/articles/:article_id" element={<SingleArticle />} />
      </Routes>
    </>
  )
}

export default App;
