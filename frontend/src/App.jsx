import { useState } from 'react'
import { CartProvider, useCart } from './features/cart/context/CartContext'
import ParticleBackground from './components/ParticleBackground/ParticleBackground'
import Navbar from './components/layout/Navbar/Navbar'
import Footer from './components/layout/Footer/Footer'
import MenuPage from './features/menu/components/MenuPage'
import CartDrawer from './features/cart/components/CartDrawer'
import CheckoutPage from './features/orders/components/CheckoutPage'
import OrderConfirmation from './features/orders/components/OrderConfirmation'

// ─── Views ────────────────────────────────────────────────────────────────────
const VIEWS = {
  MENU: 'menu',
  CHECKOUT: 'checkout',
  CONFIRMATION: 'confirmation',
}

// ─── Inner app (needs CartProvider context) ───────────────────────────────────
function AppContent() {
  const { addItem, totalItems } = useCart()
  const [view, setView] = useState(VIEWS.MENU)
  const [cartOpen, setCartOpen] = useState(false)
  const [confirmedOrder, setConfirmedOrder] = useState(null)

  function handleAddToCart(product) {
    addItem(product)
  }

  function handleCheckout() {
    setCartOpen(false)
    setView(VIEWS.CHECKOUT)
  }

  function handleOrderSuccess(order) {
    setConfirmedOrder(order)
    setView(VIEWS.CONFIRMATION)
  }

  function handleBackToMenu() {
    setView(VIEWS.MENU)
    setConfirmedOrder(null)
  }

  return (
    <>
      {/* Animated particle background — fixed, behind everything */}
      <ParticleBackground
        particleCount={80}
        particleColor="rgba(245, 158, 11, 0.45)"
        repelRadius={120}
        baseSpeed={0.7}
      />

      {/* Top navigation — always visible */}
      <Navbar
        totalItems={totalItems}
        onCartClick={() => setCartOpen(true)}
      />

      {/* Main content — switches between views */}
      {view === VIEWS.MENU && (
        <MenuPage onAddToCart={handleAddToCart} />
      )}

      {view === VIEWS.CHECKOUT && (
        <CheckoutPage
          onSuccess={handleOrderSuccess}
          onBack={handleBackToMenu}
        />
      )}

      {view === VIEWS.CONFIRMATION && (
        <OrderConfirmation
          order={confirmedOrder}
          onBackToMenu={handleBackToMenu}
        />
      )}

      {/* Footer — only on menu view */}
      {view === VIEWS.MENU && <Footer />}

      {/* Cart drawer — slides in from the right */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={handleCheckout}
      />
    </>
  )
}

// ─── Root component ───────────────────────────────────────────────────────────
export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  )
}
