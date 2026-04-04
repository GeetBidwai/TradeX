import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Spinner from '../components/Spinner'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { authLoading, isAuthenticated, login } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />
  }

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

    try {
      await login(formData)
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true })
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          'Login failed. Please check your credentials and try again.',
      )
    }
  }

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <h1 className="page-title">Login</h1>
        <p className="page-text">
          Sign in with your JWT credentials to access TradeX.
        </p>

        {error ? <div className="error-box">{error}</div> : null}
        {authLoading ? <Spinner label="Signing you in..." /> : null}

        <form className="form-grid" onSubmit={handleSubmit}>
          <div>
            <label className="field-label" htmlFor="username">
              Username or Email
            </label>
            <input
              className="input"
              id="username"
              name="username"
              onChange={handleChange}
              placeholder="Enter username"
              required
              type="text"
              value={formData.username}
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
              placeholder="Enter password"
              required
              type="password"
              value={formData.password}
            />
          </div>

          <button className="button" disabled={authLoading} type="submit">
            Login
          </button>
        </form>

        <p className="helper-text">
          Don&apos;t have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </section>
  )
}

export default LoginPage
