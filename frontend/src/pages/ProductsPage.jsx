import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Spinner from '../components/Spinner'
import { getProducts } from '../services/api'

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
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
          err.response?.data?.detail || 'Could not load products right now.',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <section className="page-card">
      <h2 className="page-title">Products</h2>
      <p className="page-text">Browse products available from the API.</p>

      {loading ? <Spinner label="Loading products..." /> : null}
      {error ? <div className="error-box">{error}</div> : null}

      {!loading && !error && products.length === 0 ? (
        <div className="empty-state">No products found.</div>
      ) : null}

      {!loading && !error && products.length > 0 ? (
        <div className="card-grid">
          {products.map((product) => (
            <article className="list-item" key={product.id}>
              <h3>{product.name}</h3>
              <p>Price: {product.price}</p>
              <p>Quantity: {product.quantity}</p>
              <p>Supplier: {product.supplier?.name || 'N/A'}</p>
              <Link className="inline-link" to={`/products/${product.id}`}>
                View details
              </Link>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  )
}

export default ProductsPage
