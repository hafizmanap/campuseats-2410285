import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import useCart from "../hooks/useCart.js";
import { useAuth } from "../hooks/useAuth.js";

function getTimeRemaining(endMillis) {
    if (!endMillis) return null;
    const diff = endMillis - Date.now();

    if (diff <= 0) return null;

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds };
}

function DailySpecial({ special, endsAt, vendor, hideWhenExpired=false }) {
    const { user } = useAuth();
    const location = useLocation();
    const { addToCart } = useCart();

    // Check explicit endsAt prop first, then fall back to special.specialEndsAt
    const rawEndsAt = endsAt ?? special?.specialEndsAt;
    const endMillis =
        rawEndsAt?.toMillis?.() ??
        (rawEndsAt ? new Date(rawEndsAt).getTime() : null);

    const [timeRemaining, setTimeRemaining] = useState(() =>
        getTimeRemaining(endMillis),
    );

    useEffect(() => {
        if (!user || !endMillis) {
            setTimeRemaining(null);
            return;
        }

        setTimeRemaining(getTimeRemaining(endMillis));

        const intervalId = setInterval(() => {
            setTimeRemaining(getTimeRemaining(endMillis));
        }, 1000);

        return () => clearInterval(intervalId);
    }, [user, endMillis]);

    if (!user) {
        return (
            <section className="card">
                <p className="tag">Today&apos;s Special</p>
                <h2>Today&apos;s special</h2>
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
        if (hideWhenExpired) return null;

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

    const cartItem = vendor
        ? {
                ...special,
                vendorId: vendor.id,
                vendorName: vendor.name,
                vendorOwnerUid: vendor.ownerUid ?? null,
            }
        : special;

    return (
        <section className="card row daily-special-card">
            <div>
                <p className="tag">Today&apos;s Special</p>
                <h2>Today&apos;s special for {displayName}</h2>
                <h3>{special.name}</h3>
                {vendor && (
                    <p className="muted">
                        at{" "}
                        <Link to={`/vendor/${vendor.id}`}>{vendor.name}</Link>
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
                    onClick={() => addToCart(cartItem)}
                >
                    Add special to cart
                </button>
            </div>

            {special.photoUrl ? (
                <img
                    src={special.photoUrl}
                    className="photo-special"
                />
            ) : (
                <div className="thumb" aria-hidden="true">
                    {special.name.charAt(0)}
                </div>
            )}
        </section>
    );
}

export default DailySpecial;
