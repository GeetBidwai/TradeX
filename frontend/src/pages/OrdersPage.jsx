import { useEffect, useMemo, useState } from 'react'
import Spinner from '../components/Spinner'
import { getLogistics, getOrders } from '../services/api'

function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [logistics, setLogistics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrdersAndLogistics = async () => {
      setLoading(true)
      setError('')

      try {
        const [ordersResponse, logisticsResponse] = await Promise.all([
          getOrders(),
          getLogistics(),
        ])

        setOrders(ordersResponse.data)
        setLogistics(logisticsResponse.data)
      } catch (err) {
        setError(
          err.response?.data?.detail || 'Could not load orders right now.',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchOrdersAndLogistics()
  }, [])

  const logisticsByOrderId = useMemo(
    () =>
      logistics.reduce((map, item) => {
        map[item.order] = item
        return map
      }, {}),
    [logistics],
  )

  return (
    <section className="page-card">
      <h2 className="page-title">Orders</h2>
      <p className="page-text">
        View your orders or incoming supplier orders with logistics status.
      </p>

      {loading ? <Spinner label="Loading orders..." /> : null}
      {error ? <div className="error-box">{error}</div> : null}

      {!loading && !error && orders.length === 0 ? (
        <div className="empty-state">No orders found.</div>
      ) : null}

      {!loading && !error && orders.length > 0 ? (
        <ul className="list">
          {orders.map((order) => {
            const logisticsItem = logisticsByOrderId[order.id]

            return (
              <li className="list-item" key={order.id}>
                <h3>Order #{order.id}</h3>
                <p>Product: {order.product?.name || 'N/A'}</p>
                <p>Buyer: {order.user?.name || 'N/A'}</p>
                <p>Quantity: {order.quantity}</p>
                <p>
                  Date:{' '}
                  {order.order_date
                    ? new Date(order.order_date).toLocaleString()
                    : 'N/A'}
                </p>
                <p>Status: {logisticsItem?.status || 'pending'}</p>
                <p>Location: {logisticsItem?.location || 'Warehouse'}</p>
              </li>
            )
          })}
        </ul>
      ) : null}
    </section>
  )
}

export default OrdersPage
