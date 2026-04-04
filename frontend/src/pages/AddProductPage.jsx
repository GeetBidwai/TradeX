import { useState } from 'react'
import Spinner from '../components/Spinner'
import { addProduct } from '../services/api'

function AddProductPage() {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await addProduct({
        name: formData.name,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
      })

      setSuccess('Product added successfully.')
      setFormData({
        name: '',
        price: '',
        quantity: '',
      })
    } catch (err) {
      const data = err.response?.data
      setError(
        data?.detail ||
          data?.name?.[0] ||
          'Could not add the product. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page-card">
      <h2 className="page-title">Add Product</h2>
      <p className="page-text">
        Suppliers can create products that will appear in the listing.
      </p>

      {loading ? <Spinner label="Saving product..." /> : null}
      {success ? <div className="success-box">{success}</div> : null}
      {error ? <div className="error-box">{error}</div> : null}

      <form className="form-grid" onSubmit={handleSubmit}>
        <div>
          <label className="field-label" htmlFor="name">
            Product Name
          </label>
          <input
            className="input"
            id="name"
            name="name"
            onChange={handleChange}
            required
            type="text"
            value={formData.name}
          />
        </div>

        <div>
          <label className="field-label" htmlFor="price">
            Price
          </label>
          <input
            className="input"
            id="price"
            min="0"
            name="price"
            onChange={handleChange}
            required
            step="0.01"
            type="number"
            value={formData.price}
          />
        </div>

        <div>
          <label className="field-label" htmlFor="quantity">
            Quantity
          </label>
          <input
            className="input"
            id="quantity"
            min="0"
            name="quantity"
            onChange={handleChange}
            required
            type="number"
            value={formData.quantity}
          />
        </div>

        <button className="button" disabled={loading} type="submit">
          Add Product
        </button>
      </form>
    </section>
  )
}

export default AddProductPage
