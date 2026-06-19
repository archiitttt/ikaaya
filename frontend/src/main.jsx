import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import "./Icons/fontawesome";
import './index.css'
import './styles/imageOptimization.css'
import {AuthProvider} from './Context/AuthContext.jsx'
import {CartProvider} from './Context/CartContext.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
        <AuthProvider>
            <CartProvider>
                <App />
            </CartProvider>
        </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
