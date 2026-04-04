import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Spinner from '../components/Spinner'
import { useAuth } from '../context/AuthContext'
import { createOrder, getProducts } from '../services/api'

function ProductDetailsPage() {
  const navigate = useNavigate()
  const { productId } = useParams()
  const { role } = useAuth()
  const [products, setProducts] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await getProducts()
        setProducts(response.data)
      } catch (err) {
        setError(
          err.response?.data?.detail || 'Could not load product details.',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const product = useMemo(
    () => products.find((item) => String(item.id) === String(productId)),
    [productId, products],
  )

  const handleOrder = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await createOrder({
        product_id: Number(productId),
        quantity: Number(quantity),
      })
      navigate('/orders')
    } catch (err) {
      const data = err.response?.data
      const detail =
        data?.detail ||
        data?.non_field_errors?.[0] ||
        (Array.isArray(data) ? data[0] : null) ||
        (typeof data === 'string' ? data : null)

      setError(detail || 'Could not place the order.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="page-card">
      <h2 className="page-title">Product Details</h2>

      {loading ? <Spinner label="Loading product..." /> : null}
      {error ? <div className="error-box">{error}</div> : null}

      {!loading && !product ? (
        <div className="empty-state">Product not found.</div>
      ) : null}

      {!loading && product ? (
        <div className="details-grid">
          <div className="details-panel">
            <h3>{product.name}</h3>
            <p>Price: {product.price}</p>
            <p>Available Quantity: {product.quantity}</p>
            <p>Supplier: {product.supplier?.name || 'N/A'}</p>
          </div>

          {role === 'buyer' ? (
            <form className="details-panel form-grid" onSubmit={handleOrder}>
              <div>
                <label className="field-label" htmlFor="quantity">
                  Order Quantity
                </label>
                <input
                  className="input"
                  id="quantity"
                  max={product.quantity}
                  min="1"
                  onChange={(event) => setQuantity(event.target.value)}
                  required
                  type="number"
                  value={quantity}
                />
              </div>

              <button className="button" disabled={submitting} type="submit">
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          ) : (
            <div className="info-box">
              Suppliers can view product details here, but only buyers can place
              orders.
            </div>
          )}
        </div>
      ) : null}
    </section>
  )
}

export default ProductDetailsPage
