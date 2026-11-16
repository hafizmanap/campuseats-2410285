import { useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { placeOrders } from "../services/orders.js";
import CartItem from "../components/CartItem.jsx";
import CheckOutForm from "../components/CheckOutForm.jsx";
import useCart from "../hooks/useCart.js";

function CartPage() {
    const { cart, total, changeQty, removeFromCart, clearCart } = useCart();
    const { user } = useAuth();
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handlePlaceOrder(details) {
        setError("");
        try {
            // TODO 4: await placeOrders(user,cart, details), then clearCart(), then navigate('/orders')
            await placeOrders(user, cart, details);
            clearCart();
            navigate("/orders");
        } catch (err) {
            setError(`Could not place the order: ${err.message}`);
        }
    }

    if (cart.length === 0) {
        return (
            <section className="card">
                <h2>Your cart</h2>
                <p className="muted">
                    Your cart is empty. Pick something from a menu first.
                </p>
            </section>
        );
    }

    return (
        <div className="cart-layout">
            <section className="card">
                <h2>Your cart</h2>

                {error && (
                    <p className="field-error" role="alert">
                        {error}
                    </p>
                )}

                <ul className="cart-list">
                    {cart.map((line) => (
                        <CartItem
                            key={line.item.id}
                            line={line}
                            onChangeQty={changeQty}
                            onRemove={removeFromCart}
                        />
                    ))}
                </ul>

                <p className="cart-total">Total: RM {total.toFixed(2)}</p>
            </section>

            <CheckOutForm
                defaultName={user?.displayName ?? ""}
                onPlaceOrder={handlePlaceOrder}
            />
        </div>
    );
}

export default CartPage;
