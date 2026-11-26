import { useEffect, useState } from 'react'

// One hook for any "subscribeTo…" service function. deps = the arguments it needs.
export function useSubscription(subscribe, deps, initial = null) {
    const [data, setData] = useState(initial)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    
    useEffect(() => {
        if (deps.some((d) => d == null)) return // wait until e.g. user.uid exists
        setLoading(true)
        const unsubscribe = subscribe(
            ...deps,
            (value) => { setData(value); setLoading(false) },
            (err) => { setError(err.message); setLoading(false) },
        )
        return unsubscribe
    }, deps)

    return { data, loading, error }
}