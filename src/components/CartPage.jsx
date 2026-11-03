import CartItem from "./CartItem.jsx";
import CheckOutForm from "./CheckOutForm.jsx";

function CartPage({
    cart,
    onChangeQty,
    onRemove,
    onPlaceOrder,
}) {
    if(cart.length === 0) {
        return(
            <section className="card">
                <h2>Your cart</h2>
                <p className="muted">
                    Your cart is empty, Pick something from a menu first.
                </p>
            </section>
        )
    }

    const total = cart.reduce(
        (sum, line) => sum + line.item.price * line.qty, 0
    )

    return(
        <div className="cart-layout">
            <section className="card">
                <h2>Your cart</h2>

                <ul className="cart-list">
                    {cart.map((line) => (
                        <CartItem
                            key={line.item.id}
                            line={line}
                            onChangeQty={onChangeQty}
                            onRemove={onRemove}
                        />
                    ))}
                </ul>

                <div className="cart-total">
                    <h3>Total: RM {total.toFixed(2)}</h3>
                </div>

            </section>

            <CheckOutForm onPlaceOrder={onPlaceOrder} />
        </div>
    )
}

export default CartPage;