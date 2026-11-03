import { useCallback, useEffect, useState } from "react";

function useVendors() {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        async function loadVendors() {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch("/api/vendors.json", {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                setVendors(await response.json());
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message);
                }
            } finally {
                // An aborted request belongs to an effect that was already cleaned up
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        loadVendors();

        return () => controller.abort();
    }, [reloadKey]);

    const reload = useCallback(() => setReloadKey((key) => key + 1), []);

    return { vendors, loading, error, reload };
}

export default useVendors;
