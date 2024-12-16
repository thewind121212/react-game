import React from 'react'
import './index.css'
import { createRoot } from 'react-dom/client'
import Sidebar from './components/sidebar.tsx'

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <>
    <Sidebar />
    <App />
  </>
)
