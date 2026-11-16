import { Link, useParams } from "react-router";
import { useVendor } from "../hooks/useVendor.js";
import MenuList from "../components/MenuList.jsx";
import DailySpecial from "../components/DailySpecial.jsx";
import { Loading, ErrorMessage } from "../components/Status.jsx";

function VendorPage() {
    const { id } = useParams();
    const { vendor, menu, loading, error } = useVendor(id);

    if (loading) return <Loading />;
    if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
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
    const items = menu.map((item) => ({ ...item, vendorName: vendor.name }));

    return (
        <>
            <p>
                <Link to="/">&larr; All vendors</Link>
            </p>

            {vendor.special && vendor.dailySpecial && (
                <DailySpecial
                    special={vendor.dailySpecial}
                    endsAt={vendor.specialEndsAt}
                    vendor={vendor}
                />
            )}

            <section>
                <h2 className="section-title">Menu: {vendor.name}</h2>
                <p className="muted">{vendor.location} • {vendor.openHours}</p>
                <MenuList items={items} />
            </section>
        </>
    );
}

export default VendorPage;
