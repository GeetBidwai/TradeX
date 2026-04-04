import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const navigate = useNavigate()
  const { logout, role, user } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="navbar">
      <div>
        <p className="navbar-label">TradeX</p>
        <h1 className="navbar-title">
          {role === 'supplier' ? 'Supplier Portal' : 'Buyer Portal'}
        </h1>
        <p className="navbar-subtitle">
          {user?.name || user?.email || 'Authenticated user'}
        </p>
      </div>

      <nav className="navbar-actions">
        <NavLink
          className={({ isActive }) =>
            `button ${isActive ? 'active' : 'secondary'}`
          }
          to="/dashboard"
        >
          Dashboard
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `button ${isActive ? 'active' : 'secondary'}`
          }
          to="/products"
        >
          Products
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `button ${isActive ? 'active' : 'secondary'}`
          }
          to="/orders"
        >
          Orders
        </NavLink>
        {role === 'supplier' ? (
          <NavLink
            className={({ isActive }) =>
              `button ${isActive ? 'active' : 'secondary'}`
            }
            to="/add-product"
          >
            Add Product
          </NavLink>
        ) : null}
        <button className="button secondary" onClick={handleLogout} type="button">
          Logout
        </button>
      </nav>
    </header>
  )
}

export default Navbar
