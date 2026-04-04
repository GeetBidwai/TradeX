import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function DashboardPage() {
  const { role, user } = useAuth()

  if (role === 'supplier') {
    return (
      <section className="page-card">
        <h2 className="page-title">Supplier Dashboard</h2>
        <p className="page-text">
          Welcome {user?.name || 'Supplier'}. Manage products and track incoming
          orders.
        </p>

        <div className="action-grid">
          <Link className="action-card" to="/add-product">
            <h3>Add Product</h3>
            <p>Create a new product for buyers to order.</p>
          </Link>
          <Link className="action-card" to="/products">
            <h3>My Products</h3>
            <p>Review the products connected to your supplier account.</p>
          </Link>
          <Link className="action-card" to="/orders">
            <h3>Incoming Orders</h3>
            <p>View the orders placed against your products.</p>
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="page-card">
      <h2 className="page-title">Buyer Dashboard</h2>
      <p className="page-text">
        Welcome {user?.name || 'Buyer'}. Browse products, place orders, and
        monitor order status.
      </p>

      <div className="action-grid">
        <Link className="action-card" to="/products">
          <h3>Browse Products</h3>
          <p>Open product details and place new orders.</p>
        </Link>
        <Link className="action-card" to="/orders">
          <h3>My Orders</h3>
          <p>Check placed orders and logistics updates.</p>
        </Link>
      </div>
    </section>
  )
}

export default DashboardPage
