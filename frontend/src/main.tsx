import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/global.css'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// Nếu không có Client ID → render App bình thường không wrap Google OAuth
const AppWithProvider = GOOGLE_CLIENT_ID
  ? () => (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    )
  : () => <App />;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWithProvider />
  </React.StrictMode>,
)
