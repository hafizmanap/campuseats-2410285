import { useEffect, useState } from "react";

function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(() => {
        try {
            const stored = localStorage.getItem(key);
            return stored !== null ? JSON.parse(stored) : initialValue;
        } catch {
            // Corrupted JSON or storage blocked: start from the initial value
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {
            // Storage full or disabled (e.g. private mode): keep working in memory
        }
    }, [key, value]);

    return [value, setValue];
}

export default useLocalStorage;
