import { useEffect, useState } from "react";
import { Link } from "react-router";
import useCart from "../hooks/useCart.js";

function getTimeRemaining(endsAt) {
    const diff = new Date(endsAt).getTime() - Date.now();

    if (diff <= 0) return null;

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds };
}

// Pass `vendor` to show a link to that vendor's page (used on the home page)
function DailySpecial({ special, vendor }) {
    const { addToCart } = useCart();
    const [timeRemaining, setTimeRemaining] = useState(() =>
        getTimeRemaining(special.endsAt),
    );

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimeRemaining(getTimeRemaining(special.endsAt));
        }, 1000);

        return () => clearInterval(intervalId);
    }, [special.endsAt]);

    if (!timeRemaining) {
        return (
            <section className="card">
                <h2>Daily Special</h2>
                <p>This daily special has ended.</p>
            </section>
        );
    }

    const { days, hours, minutes, seconds } = timeRemaining;
    const clock = [hours, minutes, seconds]
        .map((n) => String(n).padStart(2, "0"))
        .join(":");

    return (
        <section className="card">
            <p className="tag">Today&apos;s Special</p>
            <h2>{special.name}</h2>
            {vendor && (
                <p className="muted">
                    at <Link to={`/vendor/${vendor.id}`}>{vendor.name}</Link>
                </p>
            )}
            <p className="price">RM {special.price.toFixed(2)}</p>

            <p role="timer" aria-live="off">
                Time remaining: {days > 0 ? `${days}d ` : ""}
                {clock}
            </p>

            <button
                className="btn"
                type="button"
                onClick={() => addToCart(special)}
            >
                Add special to cart
            </button>
        </section>
    );
}

export default DailySpecial;
