import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Spinner from '../components/Spinner'
import { useAuth } from '../context/AuthContext'

function RegisterPage() {
  const navigate = useNavigate()
  const { authLoading, register } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer',
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      await register(formData)
      setMessage('Registration successful. Please log in to continue.')
      window.setTimeout(() => navigate('/login'), 900)
    } catch (err) {
      const data = err.response?.data
      setError(
        data?.email?.[0] ||
          data?.detail ||
          'Registration failed. Please review your details.',
      )
    }
  }

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <h1 className="page-title">Register</h1>
        <p className="page-text">
          Create a TradeX profile as a buyer or supplier.
        </p>

        {message ? <div className="success-box">{message}</div> : null}
        {error ? <div className="error-box">{error}</div> : null}
        {authLoading ? <Spinner label="Creating account..." /> : null}

        <form className="form-grid" onSubmit={handleSubmit}>
          <div>
            <label className="field-label" htmlFor="name">
              Full Name
            </label>
            <input
              className="input"
              id="name"
              name="name"
              onChange={handleChange}
              placeholder="Enter your name"
              required
              type="text"
              value={formData.name}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="email">
              Email
            </label>
            <input
              className="input"
              id="email"
              name="email"
              onChange={handleChange}
              placeholder="Enter your email"
              required
              type="email"
              value={formData.email}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="password">
              Password
            </label>
            <input
              className="input"
              id="password"
              name="password"
              onChange={handleChange}
              placeholder="Create a password"
              required
              type="password"
              value={formData.password}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              className="input"
              id="confirmPassword"
              name="confirmPassword"
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              type="password"
              value={formData.confirmPassword}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="role">
              Role
            </label>
            <select
              className="input"
              id="role"
              name="role"
              onChange={handleChange}
              value={formData.role}
            >
              <option value="buyer">Buyer</option>
              <option value="supplier">Supplier</option>
            </select>
          </div>

          <button className="button" disabled={authLoading} type="submit">
            Register
          </button>
        </form>

        <p className="helper-text">
          Already have an account? <Link to="/login">Go to login</Link>
        </p>
      </div>
    </section>
  )
}

export default RegisterPage
