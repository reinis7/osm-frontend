import Navbar from './components/Navbar'
import MapTiler from './components/MapTiler'
import './App.scss'
import { MapProvider } from '../context/MapContext'

function App() {

  return (
    <MapProvider>
      <div className='App'>
        <Navbar />
        <MapTiler />
      </div>
    </MapProvider>
  )
}

export default App
