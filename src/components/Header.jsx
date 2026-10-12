function Header({ cartCount }) {
    return (
        <header className="header">
            <h1 className="logo">CampusEats</h1>
            <nav className="nav">
                <a href="/">Vendors</a>
                <a href="/cart">My Orders</a>
                <a href="/cart" className="cart">
                    Cart
                    <span className="badge">{cartCount}</span>
                </a>
            </nav>
        </header>
    );
}

export default Header;