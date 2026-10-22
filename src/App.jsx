import { useState, useEffect } from "react";
// import vendors from "./data/vendors.js";
import Header from "./components/Header.jsx";
import VendorCard from "./components/VendorCard.jsx";
import MenuList from "./components/MenuList.jsx";
import Footer from "./components/Footer.jsx";
import { Loading, ErrorMessage } from "./components/Status.jsx";
import CartPage from "./components/CartPage.jsx";
import DailySpecial from "./components/DailySpecial.jsx";

function App() {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);

    const [selectedVendorId, setSelectedVendorId] = useState(null);
    const [cart, setCart] = useState([]);
    const [view, setView] = useState("menu"); // "menu" or "cart"
    const [lastOrder, setLastOrder] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        async function loadVendors() {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch("/api/vendors.json", {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setVendors(data);
                setSelectedVendorId(data[0]?.id || null);
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        }

        loadVendors();

        return () => {
            controller.abort();
        };
    }, [reloadKey]);

    const selectedVendor = vendors.find((v) => v.id === selectedVendorId) || {
        name: "",
        menu: [],
    };

    const cartCount = cart.reduce((sum, line) => sum + line.qty, 0);

    function handleAddToCart(item) {
        setCart((prevCart) => {
            const existing = prevCart.find((line) => line.item.id === item.id);
            if (existing) {
                return prevCart.map((line) =>
                    line.item.id === item.id
                        ? { ...line, qty: line.qty + 1 }
                        : line,
                );
            } else {
                return [...prevCart, { item, qty: 1 }];
            }
        });
    }

    function handleChangeQty(itemId, delta) {
        setCart((prevCart) =>
            prevCart
                .map((line) =>
                    line.item.id === itemId
                        ? { ...line, qty: Math.max(0, line.qty + delta) }
                        : line,
                )
                .filter((line) => line.qty > 0),
        );
    }

    function handleRemove(itemId) {
        setCart((prevCart) =>
            prevCart.filter((line) => line.item.id !== itemId),
        );
    }

    function handlePlaceOrder(details) {
        const total = cart.reduce(
            (sum, line) => sum + line.item.price * line.qty,
            0,
        );

        setLastOrder({ ...details, total });
        setCart([]);
        setView("done");
    }

    let content;

    if (view === "done") {
        content = (
            <section className="card">
                <h2>Order Placed!</h2>
                <p>Thank you for your order, {lastOrder.name}!</p>
                <p>Total: ${lastOrder.total.toFixed(2)}</p>
                <button
                    type="button"
                    className="btn"
                    onClick={() => setView("menu")}
                >
                    Back to Menu
                </button>
            </section>
        );
    } else if (view === "cart") {
        content = (
            <CartPage
                cart={cart}
                onChangeQty={handleChangeQty}
                onRemove={handleRemove}
                onPlaceOrder={handlePlaceOrder}
            />
        );
    } else if (loading) {
        content = <Loading />;
    } else if (error) {
        content = <ErrorMessage message={error} />;
    } else if (vendors.length === 0) {
        content = <p className="muted">No vendors available.</p>;
    } else {
        content = (
            <>
                <section>
                    <h2 className="section-title">Choose a vendor</h2>

                    <div className="vendor-grid">
                        {vendors.map((vendor) => (
                            <VendorCard
                                key={vendor.id}
                                vendor={vendor}
                                isSelected={vendor.id === selectedVendorId}
                                onSelect={setSelectedVendorId}
                            />
                        ))}
                    </div>
                </section>
                {selectedVendor && (
                    <section>
                        <h2 className="section-title">
                            Menu: {selectedVendor.name}
                        </h2>
                        <MenuList
                            items={selectedVendor.menu}
                            onAdd={handleAddToCart}
                        />
                    </section>
                )}

                {selectedVendor?.dailySpecial && (
                    <DailySpecial
                        special={selectedVendor.dailySpecial}
                        onAdd={handleAddToCart}
                    />
                )}
            </>
        );
    }

    return (
        <>
            <Header
                cartCount={cart.length}
                onShowMenu={() => setView("menu")}
                onShowCart={() => setView("cart")}
            />
            <main className="container">{content}</main>
            <Footer />
        </>
    );
}

export default App;
