
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import './index.css'

console.log("Attempting to render app")
try {
  const rootElement = document.getElementById('root')
  if (!rootElement) {
    throw new Error('Root element not found')
  }
  ReactDOM.createRoot(rootElement).render(
    <AuthProvider>
      <App />
    </AuthProvider>
  )
  console.log("App rendered successfully")
} catch (error) {
  console.error("Error rendering app:", error)
}
