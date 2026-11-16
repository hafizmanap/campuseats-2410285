import { useCallback, useEffect, useState } from "react";
import { subscribeToVendors } from "../services/vendors.js";

function useVendors() {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        setLoading(true);
        setError(null);
        const unsubscribe = subscribeToVendors(
            (data) => {
                setVendors(data);
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching vendors:", err);
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe(); // Stop listening when the component unmounts or reloadKey changes
    }, [reloadKey]);

    const reload = useCallback(() => setReloadKey((key) => key + 1), []);

    return { vendors, loading, error, reload };
}

export default useVendors;
