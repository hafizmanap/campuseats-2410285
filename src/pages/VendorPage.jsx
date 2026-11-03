import { Link, useParams } from "react-router";
import useVendors from "../hooks/useVendors.js";
import MenuList from "../components/MenuList.jsx";
import DailySpecial from "../components/DailySpecial.jsx";
import { Loading, ErrorMessage } from "../components/Status.jsx";

function VendorPage() {
    const { id } = useParams();
    const { vendors, loading, error, reload } = useVendors();

    if (loading) return <Loading />;
    if (error) return <ErrorMessage message={error} onRetry={reload} />;

    const vendor = vendors.find((v) => v.id === id);

    if (!vendor) {
        return (
            <section className="card">
                <h2>Vendor not found</h2>
                <p className="muted">There is no vendor with that address.</p>
                <Link to="/">Back to vendors</Link>
            </section>
        );
    }

    return (
        <>
            <p>
                <Link to="/">&larr; All vendors</Link>
            </p>

            {vendor.dailySpecial && (
                <DailySpecial special={vendor.dailySpecial} />
            )}

            <section>
                <h2 className="section-title">Menu: {vendor.name}</h2>
                <MenuList items={vendor.menu} />
            </section>
        </>
    );
}

export default VendorPage;
