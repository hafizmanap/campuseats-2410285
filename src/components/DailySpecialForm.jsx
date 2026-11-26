import { useState } from "react";
import { updateDailySpecial } from "../services/vendors.js";

function toDateTimeLocal(ts) {
    if (!ts) return "";

    const d = ts.toDate ? ts.toDate() : new Date(ts);
    const pad = (n) => String(n).padStart(2, "0");

    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function DailySpecialForm({ vendor }) {
    const existingEndsAt =
        vendor.specialEndsAt ?? vendor.dailySpecial?.specialEndsAt;
    const [name, setName] = useState(vendor.dailySpecial?.name ?? "");
    const [description, setDescription] = useState(
        vendor.dailySpecial?.description ?? "",
    );
    const [price, setPrice] = useState(vendor.dailySpecial?.price ?? "");
    const [endsAt, setEndsAt] = useState(toDateTimeLocal(existingEndsAt));
    const [status, setStatus] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setStatus("");

        if (name.trim() && (!(Number(price) > 0) || !endsAt)) {
            return setError("Enter a valid price above 0 and an end time.");
        }

        try {
            await updateDailySpecial(vendor.id, {
                name,
                description,
                price,
                specialEndsAt: endsAt,
            });
            setStatus(
                name.trim()
                    ? "Daily special updated!"
                    : "Daily special cleared.",
            );
        } catch (err) {
            setError(err.message);
        }
    }

    async function handleClear() {
        setError("");
        setStatus("");
        
        try {
            await updateDailySpecial(vendor.id, { name: "" });
            setName("");
            setDescription("");
            setPrice("");
            setEndsAt("");
            setStatus("Daily special cleared.");
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <form className="card form" onSubmit={handleSubmit}>
            <h3>Today&apos;s Daily Special</h3>
            <input
                type="text"
                placeholder="Special item name (e.g., Nasi Lemak Ayam Goreng)"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Short description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <input
                type="number"
                step="0.01"
                placeholder="Special price (RM)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
            />
            <label>
                Ends at
                <input
                    type="datetime-local"
                    value={endsAt}
                    onChange={(e) => setEndsAt(e.target.value)}
                />
            </label>
            {error && (
                <p className="field-error" role="alert">
                    {error}
                </p>
            )}
            {status && <p className="muted">{status}</p>}
            <div style={{ display: "flex", gap: "0.5rem" }}>
                <button type="submit" className="btn">
                    Save special
                </button>
                {vendor.dailySpecial && (
                    <button
                        type="button"
                        className="btn btn-small"
                        onClick={handleClear}
                    >
                        Clear special
                    </button>
                )}
            </div>
        </form>
    );
}
