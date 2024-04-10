import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './mapbox-gl.css'
import { Home } from './page'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  </React.StrictMode>,
)
