import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ThemeProvider } from './ThemeContext'
import { DensityProvider } from './contexts/DensityContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <DensityProvider>
        <App />
      </DensityProvider>
    </ThemeProvider>
  </React.StrictMode>,
)


