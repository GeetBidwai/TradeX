import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Spinner from '../components/Spinner'
import { getProducts } from '../services/api'

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
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

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    if (!query) {
      return products
    }

    return products.filter((product) => {
      const haystack = [
        product.name,
        product.supplier?.name,
        product.supplier?.email,
      ]
        .join(' ')
        .toLowerCase()

      return haystack.includes(query)
    })
  }, [products, searchTerm])

  return (
    <section className="page-card">
      <h2 className="page-title">Marketplace Products</h2>
      <p className="page-text">
        Browse and search supplier listings before creating an enquiry or order.
      </p>

      <div className="section-gap">
        <label className="field-label" htmlFor="search">
          Search Products
        </label>
        <input
          className="input"
          id="search"
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by product or supplier"
          type="search"
          value={searchTerm}
        />
      </div>

      {loading ? <Spinner label="Loading products..." /> : null}
      {error ? <div className="error-box">{error}</div> : null}

      {!loading && !error && filteredProducts.length === 0 ? (
        <div className="empty-state">No products found.</div>
      ) : null}

      {!loading && !error && filteredProducts.length > 0 ? (
        <div className="card-grid">
          {filteredProducts.map((product) => (
            <article className="list-item" key={product.id}>
              <h3>{product.name}</h3>
              <p>Price: {product.price}</p>
              <p>Quantity: {product.quantity}</p>
              <p>Supplier: {product.supplier?.name || product.supplier?.email || 'N/A'}</p>
              <Link className="inline-link" to={`/products/${product.id}`}>
                Open product page
              </Link>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  )
}

export default ProductsPage
