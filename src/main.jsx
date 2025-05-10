import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'
import './index.css' // Global styles
import { AuthProvider } from './contexts/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* Router Setup */}
      <AuthProvider> {/* Auth Context Setup */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
