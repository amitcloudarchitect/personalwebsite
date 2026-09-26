import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import App from '@/App'
import { ConfigProvider } from '@/hooks/useConfig'
import { SessionProvider } from '@/hooks/useSession'
import '@/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <ConfigProvider>
        <BrowserRouter>
          <SessionProvider>
            <App />
          </SessionProvider>
        </BrowserRouter>
      </ConfigProvider>
    </HelmetProvider>
  </StrictMode>,
)
