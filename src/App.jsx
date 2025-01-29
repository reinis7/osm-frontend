import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.scss'
import Navbar from './components/Navbar'
import MapTiler from './components/MapTiler'

function App() {

  return (
    <div className='App'>
      <Navbar />
      <MapTiler />
    </div>
  )
}

export default App
