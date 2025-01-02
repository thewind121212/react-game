import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Introduction from './components/Introduction.tsx'
import FlappyBird from './components/FlappyBird.tsx'
import './index.css'
import { createRoot } from 'react-dom/client'
import { WebSocketProvider } from './wrapper/WebSocketWrapper.tsx'
import Sidebar from './components/SideBar'

import { CreateTableView, CaroGame } from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <>
    <BrowserRouter>
      <WebSocketProvider>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Introduction />} />
          <Route path="/caro" element={<CreateTableView />} />
          <Route path="/flappybird" element={<FlappyBird />} />
          <Route path="/caro/:roomId" element={<CaroGame />} />
        </Routes>
      </WebSocketProvider>
    </BrowserRouter>
  </>
)
