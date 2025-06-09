
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId='347974170752-le55fdtqkgk34vhr7b1rgeqlopp6hmqu.apps.googleusercontent.com'>
      <App />
  </GoogleOAuthProvider>,
)
