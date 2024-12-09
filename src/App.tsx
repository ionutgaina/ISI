import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import MapComponent from './pages/Map/Map'



function App() {
  return (
    // <div style={
    //   {
    //     padding: 0,
    //     margin: 0,
    //     height: '100vh',
    //     width: '100vw'
    //   }
    // }>
    //   {/* <MapComponent /> */}



      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/map" element={<MapComponent />} />
          <Route path="/register" element={<Register />} />
        </Routes>

      </BrowserRouter>
    // </div>
  )
}

export default App
