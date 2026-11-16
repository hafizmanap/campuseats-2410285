import { collection, doc, onSnapshot, writeBatch, Timestamp } from 'firebase/firestore'
import { db } from '../firebase.js'

// Every subscribe function returns an unsubscribe function for useEffect cleanup.
export function subscribeToVendors(onData, onError) {
    return onSnapshot(
        collection(db, 'vendors'),
        (snapshot) => onData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))),
        onError,
    )
}

export function subscribeToVendor(vendorId, onData, onError) {
    return onSnapshot(
        doc(db, 'vendors', vendorId),
        (snap) => onData(snap.exists() ? { id: snap.id, ...snap.data() } : null),
        onError,
    )
}

// Menus are a subcollection: vendors/{vendorId}/menu/{itemId}
export function subscribeToMenu(vendorId, onData, onError) {
    return onSnapshot(
        collection(db, 'vendors', vendorId, 'menu'),
        (snapshot) => onData(snapshot.docs.map((d) => ({ id: d.id, vendorId, ...d.data() }))),
        onError,
    )
}

// One-off: copy public/api/vendors.json into Firestore. A batch writes all or nothing.
export async function seedDemoData(vendors) {
    const batch = writeBatch(db);

    for (const { menu, id, dailySpecial, ...vendor } of vendors) {
        const formattedSpecial = dailySpecial
            ? {
                    ...dailySpecial,
                    ...(dailySpecial.specialEndsAt
                        ? {
                                specialEndsAt: Timestamp.fromDate(
                                    new Date(dailySpecial.specialEndsAt),
                                ),
                            }
                        : {}),
                }
            : undefined;

        batch.set(doc(db, 'vendors', id), {
            ...vendor,
            ...(formattedSpecial ? { dailySpecial: formattedSpecial } : {}),
        });

        for (const { id: itemId, ...item } of menu) {
            batch.set(doc(db, 'vendors', id, 'menu', itemId), item);
        }
    }

    await batch.commit();
}
