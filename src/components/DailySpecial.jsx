import { useEffect, useState } from "react";

function getTimeRemaining(endsAt) {
    const diff = new Date(endsAt).getTime() - Date.now();

    if (diff <= 0)
        return null;

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) /3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds};
}

function DailySpecial({ special, onAdd}) {
    const [timeRemaining, setTimeRemaining] = useState(
        () => getTimeRemaining(special.endsAt)
    );

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimeRemaining(getTimeRemaining(special.endsAt))
        }, 1000)

        return () => clearInterval(intervalId)
    }, [special.endsAt]);

    if (!timeRemaining) {
        return(
            <section className="card">
                <h2>Daily Special</h2>
                <p>This daily special has ended.</p>
            </section>
        )
    }

    const { days, hours, minutes, seconds} = timeRemaining;

    return(
        <section className="card">
            <p className="tag">Today's Special</p>
            <h2>{special.name}</h2>
            <p className="price">RM {special.price.toFixed(2)}</p>

            <p role="timer" aria-live="off">
                Time Remaining: {days}d{''}:
                {String(hours).padStart(2, '0')}:
                {String(minutes).padStart(2, '0')}:
                {String(seconds).padStart(2, '0')}
            </p>

            <button className="btn" type="button" onClick={() => onAdd(special)}>
                Add special to cart
            </button>
        </section>
    )
}

export default DailySpecial;