import React from 'react'
import ReactDOM from 'react-dom/client'
import './theme.css'
import './app.css'
import { App } from './App'
import './lib/firebase'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
