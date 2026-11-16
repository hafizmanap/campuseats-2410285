import { useCallback, useRef, useEffect, useState } from "react";

function readValue(key, initialValue) {
    if (key === null) return initialValue;

    try {
        const stored = localStorage.getItem(key);
        return stored !== null ? JSON.parse(stored) : initialValue;
    } catch (error) {
        console.warn(`Error reading localStorage key "${key}":`, error);
        return initialValue;
    }
}

function useLocalStorage(key, initialValue) {
    const initialRef = useRef(initialValue);

    const [storedState, setStoredState] = useState(() => {
        return {
            key,
            value: readValue(key, initialValue),
        };
    });

    const value = storedState.key === key ? storedState.value : readValue(key, initialValue);

    useEffect(() => {
        if (storedState.key !== key) {
            setStoredState({
                key,
                value: readValue(key, initialValue),
            });
        }
    }, [key, initialValue, storedState.key]);

    useEffect(() => {
        if (key === null) return;

        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedState]);

    const setValue = useCallback(
        (nextValue) => {
            setStoredState((current) => {
                const currentValue =
                    current.key === key
                        ? current.value
                        : readValue(key, initialRef.current);
                
                return {
                    key,
                    value:
                        typeof nextValue === "function"
                            ? nextValue(currentValue)
                            : nextValue,
                };
            });
        },
        [key],
    );

    return [value, setValue];
}

export default useLocalStorage;