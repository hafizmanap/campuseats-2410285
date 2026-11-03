import { useNavigate } from "react-router";
import CartItem from "../components/CartItem.jsx";
import CheckOutForm from "../components/CheckOutForm.jsx";
import useCart from "../hooks/useCart.js";

function CartPage() {
    const { cart, total, changeQty, removeFromCart, placeOrder } = useCart();
    const navigate = useNavigate();

    function handlePlaceOrder(details) {
        placeOrder(details);
        navigate("/orders");
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

            <CheckOutForm onPlaceOrder={handlePlaceOrder} />
        </div>
    );
}

export default CartPage;
