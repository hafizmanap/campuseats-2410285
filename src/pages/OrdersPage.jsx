import { Link } from "react-router";
import useCart from "../hooks/useCart.js";

function OrdersPage() {
    const { orders } = useCart();

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
                        <h3>
                            {order.name} &middot; Mahallah {order.mahallah}
                        </h3>
                        <p className="muted">
                            Pickup at {order.pickupTime} &middot; placed{" "}
                            {new Date(order.placedAt).toLocaleString()}
                        </p>
                        <ul>
                            {order.items.map((line) => (
                                <li key={line.item.id}>
                                    {line.qty} &times; {line.item.name}
                                </li>
                            ))}
                        </ul>
                        <p className="price">Total: RM {order.total.toFixed(2)}</p>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default OrdersPage;
