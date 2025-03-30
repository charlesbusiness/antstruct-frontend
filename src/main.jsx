;import * as React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CssBaseline from '@mui/material/CssBaseline';
import AuthProvider from './contexts/authContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CssBaseline />
     <AuthProvider>
      <App />
    </AuthProvider>
   
  </StrictMode>,
)

