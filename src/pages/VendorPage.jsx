import { Link, useParams } from "react-router";
import { useVendor } from "../hooks/useVendor.js";
import MenuList from "../components/MenuList.jsx";
import DailySpecial from "../components/DailySpecial.jsx";
import { Loading, ErrorMessage } from "../components/Status.jsx";

function VendorPage() {
    const { id } = useParams();
    const { vendor, menu, loading, error } = useVendor(id);

    if (loading) return <Loading />;
    if (error)
        return (
            <ErrorMessage
                message={error}
                onRetry={() => window.location.reload()}
            />
        );

    if (!vendor) {
        return (
            <section className="card">
                <h2>Vendor not found</h2>
                <p className="muted">There is no vendor with that address.</p>
                <Link to="/">Back to vendors</Link>
            </section>
        );
    }

    // Each cart line must know its vendor, so orders can be split per vendor
    const items = menu.map((item) => ({
        ...item,
        vendorName: vendor.name,
        vendorOwnerUid: vendor.ownerUid ?? null,
    }));

    const activeSpecial =
        vendor.dailySpecial ||
        (typeof vendor.special === "object" ? vendor.special : null);

    return (
        <>
            <p>
                <Link to="/">&larr; All vendors</Link>
            </p>

            <section>
                <h2 className="section-title">Menu: {vendor.name}</h2>
                <p className="muted">
                    {vendor.location} • {vendor.openHours}
                </p>
                {activeSpecial && (
                    <DailySpecial
                        special={activeSpecial}
                        endsAt={
                            vendor.specialEndsAt ?? activeSpecial.specialEndsAt
                        }
                        vendor={vendor}
                        hideWhenExpired
                    />
                )}
                <MenuList items={items} />
            </section>
        </>
    );
}

export default VendorPage;
