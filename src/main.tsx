import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AppInitializer } from './features/auth/AppInitializer'
import { GlobalErrorBoundary } from './shared/errors/GlobalErrorBoundary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <AppInitializer />
      <App />
    </GlobalErrorBoundary>
  </StrictMode>,
)
