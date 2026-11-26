import {
    collection,
    doc,
    onSnapshot,
    query,
    where,
    addDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    writeBatch,
    serverTimestamp,
    Timestamp,
} from "firebase/firestore";
import { db } from "../firebase.js";

const list = (s) => s.docs.map((d) => ({ id: d.id, ...d.data() }));

// Students only see approved stalls (and the rules only allow that query).
export function subscribeToVendors(onData, onError) {
    // TODO 2: const q = query(collection(db, 'vendors'), where(...)) approved must be true
    const q = query(collection(db, "vendors"), where("approved", "==", true));
    return onSnapshot(q, (s) => onData(list(s)), onError);
}

export function subscribeToVendor(vendorId, onData, onError) {
    return onSnapshot(
        doc(db, "vendors", vendorId),
        (snap) =>
            onData(snap.exists() ? { id: snap.id, ...snap.data() } : null),
        onError,
    );
}

// Menus are a subcollection: vendors/{vendorId}/menu/{itemId}
export function subscribeToMenu(vendorId, onData, onError) {
    return onSnapshot(
        collection(db, "vendors", vendorId, "menu"),
        (snapshot) =>
            onData(
                snapshot.docs.map((d) => ({
                    id: d.id,
                    vendorId,
                    ...d.data(),
                })),
            ),
        onError,
    );
}

export function subscribeToMyVendor(uid, onData, onError) {
    const q = query(collection(db, "vendors"), where("ownerUid", "==", uid));
    return onSnapshot(q, (s) => onData(list(s)[0] ?? null), onError);
}

export function subscribeToPendingVendors(onData, onError) {
    const q = query(collection(db, "vendors"), where("approved", "==", false));
    return onSnapshot(q, (s) => onData(list(s)), onError);
}

export function applyAsVendor(user, { name, location, openHours }) {
    return addDoc(collection(db, "vendors"), {
        name,
        location,
        openHours,
        isOpen: false,
        approved: false,
        ownerUid: user.uid,
        createdAt: serverTimestamp(),
    });
}

// Approve the stall AND make its owner a vendor: both or neither.
export async function approveVendor(vendor) {
    const batch = writeBatch(db);
    batch.update(doc(db, "vendors", vendor.id), { approved: true });
    batch.update(doc(db, "users", vendor.ownerUid), { role: "vendor" });
    await batch.commit();
}

export const setVendorOpen = (vendorId, isOpen) =>
    updateDoc(doc(db, "vendors", vendorId), { isOpen });

export async function addMenuItem(vendorId, item) {
    const ref = doc(collection(db, "vendors", vendorId, "menu"));
    await setDoc(ref, {
        ...item,
        photoUrl: item.photoUrl || null,
        available: true,
    });
}

export const setItemAvailable = (vendorId, itemId, available) =>
    updateDoc(doc(db, "vendors", vendorId, "menu", itemId), { available });

export const deleteMenuItem = (vendorId, itemId) =>
    deleteDoc(doc(db, "vendors", vendorId, "menu", itemId));

export async function updateDailySpecial(vendorId, { name, description, price, specialEndsAt }) {
    const ref = doc(db, "vendors", vendorId);
    if (!name?.trim()) {
        return updateDoc(ref, {
            special: false,
            dailySpecial: null,
            specialEndsAt: null,
        });
    }
    const endTimestamp = specialEndsAt ? Timestamp.fromDate(new Date(specialEndsAt)) : null;
    return updateDoc(ref, {
        special: true,
        specialEndsAt: endTimestamp,
        dailySpecial: {
            id: `${vendorId}-special`,
            name: name.trim(),
            description: description?.trim() || "",
            price: Number(price),
            specialEndsAt: endTimestamp,
        },
    });
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

        batch.set(doc(db, "vendors", id), {
            ...vendor,
            approved: true,
            ownerUid: null,
            ...(formattedSpecial ? { dailySpecial: formattedSpecial } : {}),
        });

        for (const { id: itemId, ...item } of menu) {
            batch.set(doc(db, "vendors", id, "menu", itemId), item);
        }
    }

    await batch.commit();
}
