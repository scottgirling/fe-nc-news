import { useState } from 'react'
import './App.css'
import { Header } from './components/Header';
import { ArticleList } from './components/ArticleList';

function App() {

  return (
    <>
      <Header></Header>
      <ArticleList></ArticleList>
    </>
  )
}

export default App;
