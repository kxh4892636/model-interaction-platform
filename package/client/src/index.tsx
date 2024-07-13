import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Outlet } from 'react-router-dom'
import './mapbox-gl.css'
import { App } from './page/App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App></App>
    </BrowserRouter>
  </React.StrictMode>,
)
