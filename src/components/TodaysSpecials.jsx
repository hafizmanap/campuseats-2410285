import DailySpecial from "./DailySpecial.jsx";

function isActive(special) {
    return new Date(special.endsAt).getTime() > Date.now();
}

function TodaysSpecials({ vendors }) {
    const withSpecials = vendors.filter(
        (vendor) => vendor.dailySpecial && isActive(vendor.dailySpecial),
    );

    return (
        <section>
            <h2 className="section-title">Today&apos;s specials</h2>

            {withSpecials.length === 0 ? (
                <p className="muted">No specials running right now.</p>
            ) : (
                <div className="vendor-grid">
                    {withSpecials.map((vendor) => (
                        <DailySpecial
                            key={vendor.id}
                            special={vendor.dailySpecial}
                            vendor={vendor}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

export default TodaysSpecials;
