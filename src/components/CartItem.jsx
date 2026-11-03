function CartItem({ line, onRemove, onChangeQty }) {
    const {item, qty} = line;

    return(
        <li className="cart-line">
            <div>
                <p className="cart-name">{item.name}</p>
                <p className="cart-price">RM {item.price.toFixed(2)}</p>
            </div>

            <div className="qty">
                <button  type="button" onClick={() => onChangeQty(item.id, -1)}>-</button>
                <span>{qty}</span>
                <button  type="button" onClick={() => onChangeQty(item.id, 1)}>+</button>
            </div>

            <button className="btn btn-remove" type="button" onClick={() => onRemove(item.id)}>
                Remove
            </button>
        </li>
    )
}

export default CartItem;