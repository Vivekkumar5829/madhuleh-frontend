import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:          1000 * 60 * 5,   // 5 min
      gcTime:             1000 * 60 * 10,  // 10 min
      retry:              1,
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1A0D00',
            color:      '#FFF8E7',
            borderRadius: '14px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize:   '13.5px',
            fontWeight: '500',
            padding:    '12px 16px',
          },
          success: { iconTheme: { primary: '#F5A800', secondary: '#1A0D00' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#fff'    } },
        }}
      />
    </QueryClientProvider>
  </React.StrictMode>
)
