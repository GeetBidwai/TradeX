import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function MarketplacePage() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />
  }

  return (
    <section className="page-card">
      <div className="hero-panel">
        <div>
          <p className="eyebrow">Complete Workflow Overview</p>
          <h1 className="page-title">TradeX Asia Marketplace</h1>
          <p className="page-text">
            Sign in as a buyer or supplier to browse products, send enquiries,
            place orders, manage shipping, and track deliveries from supplier to
            final destination.
          </p>
        </div>
        <div className="action-grid">
          <Link className="action-card" to="/register">
            <h3>Create Account</h3>
            <p>Choose Buyer or Supplier during signup and enter the marketplace.</p>
          </Link>
          <Link className="action-card" to="/login">
            <h3>Login</h3>
            <p>Continue to your role-based dashboard and active workflow.</p>
          </Link>
        </div>
      </div>

      <div className="card-grid">
        <article className="list-item">
          <h3>Buyer Flow</h3>
          <p>Browse, search, enquire, place orders, pick Air or Sea, and track shipment progress.</p>
        </article>
        <article className="list-item">
          <h3>Supplier Flow</h3>
          <p>Add products, receive enquiries or orders, confirm requests, and update shipment tracking.</p>
        </article>
        <article className="list-item">
          <h3>Analytics</h3>
          <p>Review request volume, order value, and shipment stage performance inside the dashboard.</p>
        </article>
      </div>
    </section>
  )
}

export default MarketplacePage
