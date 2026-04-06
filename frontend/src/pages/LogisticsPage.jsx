import { useEffect, useMemo, useRef, useState } from 'react'
import Spinner from '../components/Spinner'
import { useAuth } from '../context/AuthContext'
import {
  createLogisticsInquiry,
  getLogisticsInquiries,
} from '../services/api'

const SERVICES = [
  {
    key: 'sea',
    title: 'Sea Freight',
    shortDescription:
      'Cost-effective shipping for bulk cargo and container loads.',
    details:
      'Sea freight is ideal for bulk cargo, high-volume container movement, and long-haul international trade routes where cost efficiency matters most.',
  },
  {
    key: 'air',
    title: 'Air Freight',
    shortDescription:
      'Fast delivery for urgent shipments and high-value goods.',
    details:
      'Air freight supports time-sensitive deliveries, urgent supply chain needs, and high-value goods that require faster transit and closer scheduling control.',
  },
  {
    key: 'warehouse',
    title: 'Warehousing',
    shortDescription:
      'Secure storage, inventory handling, and distribution support.',
    details:
      'Warehousing helps with safe storage, dispatch planning, inventory handling, and distribution support before or after transportation.',
  },
]

function LogisticsPage() {
  const { role, user } = useAuth()
  const detailsRef = useRef(null)
  const quoteRef = useRef(null)
  const [selectedService, setSelectedService] = useState(SERVICES[0])
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    serviceType: SERVICES[0].key,
    cargoType: '',
    origin: '',
    destination: '',
    quantity: '',
    weight: '',
    notes: '',
  })
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(role === 'supplier')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (role !== 'supplier') {
      return
    }

    const loadInquiries = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await getLogisticsInquiries()
        setInquiries(Array.isArray(response.data) ? response.data : [])
      } catch (err) {
        setError(err.response?.data?.detail || 'Could not load logistics requests.')
      } finally {
        setLoading(false)
      }
    }

    loadInquiries()
  }, [role])

  useEffect(() => {
    if (role === 'buyer') {
      setFormData((current) => ({
        ...current,
        fullName: current.fullName || user?.name || '',
        email: current.email || user?.email || '',
      }))
    }
  }, [role, user])

  const selectedServiceLabel = useMemo(
    () => selectedService?.title || 'Sea Freight',
    [selectedService],
  )

  const handleSelectService = (service) => {
    setSelectedService(service)
    setFormData((current) => ({
      ...current,
      serviceType: service.key,
    }))

    requestAnimationFrame(() => {
      detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      await createLogisticsInquiry({
        name: formData.fullName,
        email: formData.email,
        service_type: formData.serviceType,
        cargo_type: formData.cargoType,
        origin: formData.origin,
        destination: formData.destination,
        quantity: formData.quantity,
        weight: formData.weight,
        notes: formData.notes,
      })

      setSuccess('Logistics inquiry submitted successfully.')
      setFormData((current) => ({
        ...current,
        cargoType: '',
        origin: '',
        destination: '',
        quantity: '',
        weight: '',
        notes: '',
      }))
    } catch (err) {
      const data = err.response?.data
      const firstError =
        data?.email?.[0] ||
        data?.name?.[0] ||
        data?.service_type?.[0] ||
        data?.cargo_type?.[0] ||
        data?.origin?.[0] ||
        data?.destination?.[0] ||
        data?.quantity?.[0] ||
        data?.weight?.[0] ||
        data?.detail

      setError(firstError || 'Could not submit logistics inquiry.')
    } finally {
      setSubmitting(false)
    }
  }

  const scrollToQuote = () => {
    quoteRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (role === 'supplier') {
    return (
      <section className="page-card">
        <h2 className="page-title">Logistics</h2>
        <p className="page-text">
          Review customer logistics inquiries and reach out directly by email or
          Telegram.
        </p>

        {loading ? <Spinner label="Loading logistics inquiries..." /> : null}
        {error ? <div className="error-box">{error}</div> : null}

        {!loading && !error && inquiries.length === 0 ? (
          <div className="empty-state">No logistics requests yet.</div>
        ) : null}

        {!loading && !error && inquiries.length > 0 ? (
          <ul className="list">
            {inquiries.map((inquiry) => (
              <li className="list-item" key={inquiry.id}>
                <h3>Inquiry #{inquiry.id}</h3>
                <p>Buyer Name: {inquiry.name}</p>
                <p>Email: {inquiry.email}</p>
                <p>Service Type: {inquiry.service_type_display}</p>
                <p>Cargo Type: {inquiry.cargo_type}</p>
                <p>
                  Route: {inquiry.origin} → {inquiry.destination}
                </p>
                <p>Quantity: {inquiry.quantity}</p>
                <p>Weight: {inquiry.weight}</p>
                {inquiry.notes ? <p>Notes: {inquiry.notes}</p> : null}
                <p>
                  Created:{' '}
                  {inquiry.created_at
                    ? new Date(inquiry.created_at).toLocaleString()
                    : 'N/A'}
                </p>

                <div className="button-row section-gap">
                  <a
                    className="button"
                    href={`mailto:${inquiry.email}?subject=Logistics Inquiry #${inquiry.id}`}
                  >
                    Contact Buyer
                  </a>
                  <a
                    className="button secondary"
                    href={
                      inquiry.telegram_username
                        ? `https://t.me/${inquiry.telegram_username}`
                        : 'https://t.me/'
                    }
                    rel="noreferrer"
                    target="_blank"
                  >
                    Connect via Telegram
                  </a>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    )
  }

  return (
    <section className="page-card">
      <h2 className="page-title">Logistics</h2>
      <p className="page-text">
        Explore shipping support, choose a service, review details, and request a
        quote from one place.
      </p>

      <div className="card-grid">
        {SERVICES.map((service) => (
          <button
            className="list-item"
            key={service.key}
            onClick={() => handleSelectService(service)}
            style={{
              cursor: 'pointer',
              textAlign: 'left',
              background:
                selectedService.key === service.key ? '#eff6ff' : '#f8fafc',
            }}
            type="button"
          >
            <h3>{service.title}</h3>
            <p>{service.shortDescription}</p>
          </button>
        ))}
      </div>

      <div className="section-gap" ref={detailsRef}>
        <h3 className="section-title">{selectedServiceLabel}</h3>
        <div className="info-box">
          <p style={{ margin: 0 }}>{selectedService.details}</p>
        </div>
        <div className="button-row">
          <button className="button" onClick={scrollToQuote} type="button">
            Request a Quote
          </button>
        </div>
      </div>

      <div className="section-gap" ref={quoteRef}>
        <h3 className="section-title">Request a Quote</h3>

        {success ? <div className="success-box">{success}</div> : null}
        {error ? <div className="error-box">{error}</div> : null}

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="details-grid">
            <div>
              <label className="field-label" htmlFor="fullName">
                Full Name
              </label>
              <input
                className="input"
                id="fullName"
                name="fullName"
                onChange={handleChange}
                required
                type="text"
                value={formData.fullName}
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
                required
                type="email"
                value={formData.email}
              />
            </div>

            <div>
              <label className="field-label" htmlFor="serviceType">
                Service Type
              </label>
              <input
                className="input"
                id="serviceType"
                name="serviceType"
                readOnly
                type="text"
                value={selectedServiceLabel}
              />
            </div>

            <div>
              <label className="field-label" htmlFor="cargoType">
                Cargo Type
              </label>
              <input
                className="input"
                id="cargoType"
                name="cargoType"
                onChange={handleChange}
                required
                type="text"
                value={formData.cargoType}
              />
            </div>

            <div>
              <label className="field-label" htmlFor="origin">
                Origin
              </label>
              <input
                className="input"
                id="origin"
                name="origin"
                onChange={handleChange}
                required
                type="text"
                value={formData.origin}
              />
            </div>

            <div>
              <label className="field-label" htmlFor="destination">
                Destination
              </label>
              <input
                className="input"
                id="destination"
                name="destination"
                onChange={handleChange}
                required
                type="text"
                value={formData.destination}
              />
            </div>

            <div>
              <label className="field-label" htmlFor="quantity">
                Quantity
              </label>
              <input
                className="input"
                id="quantity"
                name="quantity"
                onChange={handleChange}
                required
                type="text"
                value={formData.quantity}
              />
            </div>

            <div>
              <label className="field-label" htmlFor="weight">
                Weight
              </label>
              <input
                className="input"
                id="weight"
                name="weight"
                onChange={handleChange}
                required
                type="text"
                value={formData.weight}
              />
            </div>
          </div>

          <div>
            <label className="field-label" htmlFor="notes">
              Additional Notes
            </label>
            <textarea
              className="input"
              id="notes"
              name="notes"
              onChange={handleChange}
              rows="4"
              value={formData.notes}
            />
          </div>

          <div className="button-row">
            <button className="button" disabled={submitting} type="submit">
              {submitting ? 'Submitting...' : 'Get a Quote'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default LogisticsPage
