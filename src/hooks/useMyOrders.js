import { useEffect, useState } from "react";
import { subscribeToMyOrders } from "../services/orders";
import { useAuth } from "./useAuth";

function useMyOrders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) return;
        const unsubscribe = subscribeToMyOrders(
            user.uid,
            (data) => {
                setOrders(data);
                setLoading(false)
            },
            (err) => {
                setError(err.message);
                setLoading(false)
            },
        )
        return unsubscribe;
    }, [user]);

    return { orders, loading, error}
}

export default useMyOrders;