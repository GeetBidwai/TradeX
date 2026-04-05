import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Spinner from '../components/Spinner'
import { useAuth } from '../context/AuthContext'
import { getOrderAnalytics } from '../services/api'

function DashboardPage() {
  const { role, user } = useAuth()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)

      try {
        const response = await getOrderAnalytics()
        setAnalytics(response.data)
      } catch {
        setAnalytics(null)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  const actions =
    role === 'supplier'
      ? [
          {
            title: 'Add Product',
            text: 'Create new listings for buyers in the marketplace.',
            to: '/add-product',
          },
          {
            title: 'Supplier Requests',
            text: 'Respond to enquiries and confirm incoming orders.',
            to: '/orders',
          },
          {
            title: 'My Products',
            text: 'Manage listings, stock, and product visibility.',
            to: '/products',
          },
        ]
      : [
          {
            title: 'Browse Marketplace',
            text: 'Search products and open product detail pages.',
            to: '/products',
          },
          {
            title: 'Track Orders',
            text: 'Monitor enquiries, orders, and linked shipments.',
            to: '/orders',
          },
        ]

  return (
    <section className="page-card">
      <h2 className="page-title">
        {role === 'supplier' ? 'Supplier Dashboard' : 'Buyer Dashboard'}
      </h2>
      <p className="page-text">
        Welcome {user?.name || role}. This dashboard follows the marketplace,
        request, logistics, and analytics flow.
      </p>

      <div className="action-grid">
        {actions.map((action) => (
          <Link className="action-card" key={action.title} to={action.to}>
            <h3>{action.title}</h3>
            <p>{action.text}</p>
          </Link>
        ))}
      </div>

      <div className="section-gap">
        <h3 className="section-title">Analytics Snapshot</h3>
        {loading ? <Spinner label="Loading analytics..." /> : null}

        {!loading && analytics ? (
          <div className="card-grid">
            <article className="list-item">
              <h3>Total Requests</h3>
              <p>{analytics.total_requests}</p>
            </article>
            <article className="list-item">
              <h3>Total Value</h3>
              <p>{analytics.total_value}</p>
            </article>
            <article className="list-item">
              <h3>Request Mix</h3>
              <p>Orders: {analytics.type_counts?.order || 0}</p>
              <p>Enquiries: {analytics.type_counts?.enquiry || 0}</p>
            </article>
            <article className="list-item">
              <h3>Status</h3>
              <p>Pending: {analytics.status_counts?.pending || 0}</p>
              <p>Confirmed: {analytics.status_counts?.confirmed || 0}</p>
              <p>Responded: {analytics.status_counts?.responded || 0}</p>
            </article>
            <article className="list-item">
              <h3>Shipment Performance</h3>
              <p>Supplier: {analytics.shipment_stages?.supplier || 0}</p>
              <p>Warehouse: {analytics.shipment_stages?.warehouse || 0}</p>
              <p>Transport: {analytics.shipment_stages?.transport || 0}</p>
              <p>Delivery: {analytics.shipment_stages?.delivery || 0}</p>
              <p>Final Destination: {analytics.shipment_stages?.final_destination || 0}</p>
            </article>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default DashboardPage
