function Header({ cartCount, onShowMenu, onShowCart }) {
    return (
        <header className="header">
            <h1 className="logo">CampusEats</h1>
            
            <nav className="nav">
                <a href="/" onClick={onShowMenu}>
                    Vendors
                </a>
                <a href="/" onClick={onShowCart}>
                    My Orders
                </a>
                <a href="./CartPage.jsx" className="cart" onClick={onShowCart}>
                    Cart
                    <span className="badge">{cartCount}</span>
                </a>
            </nav>
        </header>
    );
}

export default Header;