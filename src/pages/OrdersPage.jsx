import { Link } from "react-router";
import useMyOrders from "../hooks/useMyOrders.js";
import OrderStatus from "../components/OrderStatus.jsx";
import OrderActions from "../components/OrderActions.jsx";
import { Loading, ErrorMessage } from "../components/Status.jsx";

export default function OrdersPage() {
    const { orders, loading, error } = useMyOrders();

    if (loading) {
        return <Loading message="Loading your orders..." />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    if (orders.length === 0) {
        return (
            <section className="card">
                <h2>My orders</h2>
                <p className="muted">
                    No orders yet. <Link to="/">Browse the vendors</Link>.
                </p>
            </section>
        );
    }

    return (
        <section>
            <h2 className="section-title">My orders</h2>

            <ul className="order-list">
                {orders.map((order) => (
                    <li key={order.id} className="card">
                        <p className="cart-name">
                            {order.vendorName} &middot; pickup {order.pickupTime}
                        </p>
                        <p className="muted">
                            {order.items
                                .map((i) => `${i.qty}× ${i.name}`)
                                .join(", ")}
                        </p>
                        <p className="muted">
                            Placed{" "}
                            {order.createdAt
                                ? order.createdAt
                                        .toDate()
                                        .toLocaleString("en-MY")
                                : "just now"}
                        </p>
                        <p className="price">RM {order.total.toFixed(2)}</p>
                        <OrderStatus status={order.status} />
                        {order.status === 'Received' && <OrderActions order={order} />}
                    </li>
                ))}
            </ul>
        </section>
    );
}
