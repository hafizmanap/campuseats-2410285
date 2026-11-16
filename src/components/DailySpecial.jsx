import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import useCart from "../hooks/useCart.js";
import { useAuth } from "../hooks/useAuth.js";
import useLocalStorage from "../hooks/useLocalStorage.js";

//The special runs until 23:59:59 today (local time).
function getTodayEnd() {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return end.toISOString();
}

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

// Pass vendor to show a link to that vendor's page
function DailySpecial({ special, vendor }) {
    const { user } = useAuth();
    const location = useLocation();
    const { addToCart } = useCart();

    const storageKey = user ? `ce-special-${user.uid}` : null;
    const [savedEndsAt, setSavedEndsAt] = useLocalStorage(
        storageKey,
        getTodayEnd(),
    );

    const today = new Date().toDateString();
    const savedDay = new Date(savedEndsAt).toDateString();

    useEffect(() => {
        if (user && savedDay !== today) {
            setSavedEndsAt(getTodayEnd());
        }
    }, [user, savedDay, today, setSavedEndsAt]);

    const [timeRemaining, setTimeRemaining] = useState(() =>
        getTimeRemaining(savedEndsAt),
    );

    useEffect(() => {
        if (!user) {
            setTimeRemaining(null);
            return;
        }

        setTimeRemaining(getTimeRemaining(savedEndsAt));

        const intervalId = setInterval(() => {
            setTimeRemaining(getTimeRemaining(savedEndsAt));
        }, 1000);

        return () => clearInterval(intervalId);
    }, [savedEndsAt]);

    if (!user) {
        return (
            <section className="card">
                <p className="tag">Today&apos;s Special</p>
                <h2>Today&apos;s special for {displayName}</h2>
                <p className="muted">Login to see today&apos;s special.</p>
                {vendor && (
                    <p className="muted">
                        at{" "}
                        <Link to={`/vendor/${vendor.id}`}>{vendor.name}</Link>
                    </p>
                )}
                <Link
                    className="btn"
                    to="/login"
                    state={{ from: location.pathname }}
                >
                    Login
                </Link>
            </section>
        );
    }

    const displayName = user.displayName || user.email || "User";

    if (!timeRemaining) {
        return (
            <section className="card">
                <p className="tag">Today&apos;s Special</p>
                <h2>Today&apos;s special for {displayName}</h2>
                <h3>{special.name}</h3>
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
            <h2>Today&apos;s special for {displayName}</h2>
            <h3>{special.name}</h3>
            {vendor && (
                <p className="muted">
                    at <Link to={`/vendor/${vendor.id}`}>{vendor.name}</Link>
                </p>
            )}
            <p className="price">RM {special.price.toFixed(2)}</p>
            <p className="description">{special.description}</p>
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
