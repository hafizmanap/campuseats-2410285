# Reflection

### 1. What is the difference between building a UI imperatively (plain DOM code) and declaratively (React)?
In imperative UI development (plain DOM JavaScript), you manually write step-by-step instructions to manipulate DOM elements, such as querying nodes (document.getElementById), updating styles, or appending elements when state changes.
In declarative UI development (React), you define what the UI should look like for any given state using JSX, and React automatically and efficiently updates the DOM to match whenever the state changes.

### 2. Why must a component name start with a capital letter?
React and JSX use capitalization to differentiate between standard HTML elements and custom React components. Lowercase tag names (e.g., <button> or <div>) are recognized as standard built-in HTML tags, whereas capitalized tag names (e.g., <Welcome /> or <VendorCard />) instruct JSX to instantiate and render your user-defined React component function.

### 3. What does a fragment <>...</> do, and why not just use a <div>?
A React Fragment (<>...</> or <React.Fragment>) used to group multiple adjacent JSX elements together without adding an extra unnecessary node to the DOM. Using a wrapper <div> adds an unneeded element to the DOM tree, which can bloat the document structure and disrupt CSS layouts such as Flexbox, CSS Grid, or specific table hierarchies.

### 4. Name one benefit of splitting the UI into small components.
Splitting a UI into small modular components can improves code reusability and maintainability, where developers can isolate logic and test components independently, and construct complex interfaces by composing simple and single-responsibility building blocks.


## Week 6

### 1. Explain, step by step, what happens from the moment you click Place order until the new order appears on your Orders page. Name the functions in your own code that run, and say why you never call setOrders yourself.
When I click **Place order** on `CartPage`, the form calls `handlePlaceOrder(details)` in `src/pages/CartPage.jsx`, which awaits `placeOrders(user, cart, details)` in `src/services/orders.js`. Inside `placeOrders`, the cart items are grouped by `vendorId` using a `Map`, and a Firestore `writeBatch(db)` creates one new document per vendor in the top-level `orders` collection with `status: 'Received'` and a `serverTimestamp()`. Once `await batch.commit()` succeeds, `CartPage` runs `clearCart()` to empty the local cart and calls `navigate('/orders')` to open `OrdersPage`. On `OrdersPage`, the `useMyOrders()` hook triggers `subscribeToMyOrders(user.uid, ...)` in `src/services/orders.js`, which opens a real-time Firestore `onSnapshot` listener filtered by `where('studentUid', '==', uid)`. Every time Firestore commits the new order document, `onSnapshot` automatically fires its callback with the updated snapshot and calls `onData(orders)` (which updates state via `setOrders(data)` inside the hook). I never call `setOrders` manually after placing, updating, or cancelling an order because Firestore acts as the single source of truth and `onSnapshot` pushes every cloud change straight to the UI automatically.

### 2. Why is orders a top-level collection, and why does each order copy vendorName and each item’s name and price instead of storing only IDs?
Making `orders` a top-level collection instead of nesting it under `users` or `vendors` allows both students and vendors to query their orders directly with simple `where()` filters (`studentUid == uid` for students, or `vendorId == shopId` for vendors) without complex collection-group queries. Each order copies `vendorName` as well as each item's `name` and `price` at checkout time so the order serves as an immutable receipt. If a vendor later renames a dish, raises its price, or deletes the item from their menu, past orders must still display the exact name and price the student actually paid. Denormalizing these fields also avoids extra Firestore reads when rendering `OrdersPage`, since the app does not have to fetch separate vendor and menu documents just to display order history.

### 3. Your personal feature: which Firestore path and fields hold its data, and which line of your code reads it? Paste that line.
For my personal feature (Feature 5: Daily special with countdown), the data is stored in Firestore under the document path `vendors/2410285-nasinova` inside the `dailySpecial` map field, specifically using `dailySpecial.special` (boolean `true`) and `dailySpecial.specialEndsAt` (a Firestore `Timestamp`). In `src/services/vendors.js`, `subscribeToVendor` (and `subscribeToVendors`) listens to this document live with `onSnapshot`, and `src/components/DailySpecial.jsx` reads the timestamp on the following lines:

```javascript
const rawEndsAt = endsAt ?? special?.specialEndsAt;
const endMillis =
    rawEndsAt?.toMillis?.() ??
    (rawEndsAt ? new Date(rawEndsAt).getTime() : null);
```

## Week 7

### 1. One rule explained (`orders` update & delete)
```javascript
allow update: if signedIn()
  && resource.data.vendorOwnerUid == request.auth.uid
  && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['status']);

allow update: if signedIn()
  && resource.data.studentUid == request.auth.uid
  && resource.data.status == 'Received'
  && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['pickupTime']);

allow delete: if signedIn()
  && resource.data.studentUid == request.auth.uid
  && resource.data.status == 'Received';
```

In the `orders` block, the first `allow update` rule allows only a signed-in vendor whose UID matches `resource.data.vendorOwnerUid` to update an order, and `diff(resource.data).affectedKeys().hasOnly(['status'])` restricts them to changing only the `status` field they cannot alter prices or items. The second `allow update` rule allows the signed-in student who placed the order (`resource.data.studentUid == request.auth.uid`) to update it, provided `resource.data.status == 'Received'` and only `pickupTime` is modified. Similarly, `allow delete` lets that same student cancel their own order only while its status is still `'Received'`. Therefore, any other user—or a student trying to modify or cancel an order that has already moved to `'Preparing'` fails these conditions and is denied by Firestore.

### 2. Who can read and write each collection

| Collection | Who can read | Who can write |
| :--- | :--- | :--- |
| **`users/{uid}`** | The matching user (`isUser(uid)`) or an `admin`. | **Create:** The user themselves (`isUser(uid)`) only with `role == 'student'`. **Update:** An `admin`, or the user themselves as long as `role` does not change. **Delete:** `admin` only. |
| **`vendors/{vendorId}`** | Anyone (even signed-out users) if `approved == true`, plus an `admin` or the stall's owner (`ownerUid == request.auth.uid`). | **Create:** An `admin`, or any signed-in user applying with `ownerUid == request.auth.uid` and `approved == false`. **Update:** An `admin`, or the stall owner without changing `approved` or `ownerUid` (with `specialEndsAt` validated as `null` or a `timestamp`). **Delete:** `admin` only. |
| **`vendors/{vendorId}/menu/{itemId}`** | Anyone (`allow read: if true`). | An `admin`, or the signed-in owner of that parent vendor stall (`vendorOwner(vendorId) == request.auth.uid`). |
| **`orders/{orderId}`** | Signed-in users who are either the ordering student (`studentUid`), the stall owner (`vendorOwnerUid`), or an `admin`. | **Create:** A signed-in student creating their own order (`studentUid == request.auth.uid`) with `status == 'Received'` and matching `vendorOwnerUid`. **Update:** The stall owner (changing `status` only) or the ordering student (changing `pickupTime` only while `status == 'Received'`). **Delete:** The ordering student while `status == 'Received'`. |

### 3. Why hiding buttons in React is not enough
Hiding vendor buttons or routes in React (such as with `RoleRoute` or conditional rendering in `Header`) only controls what appears in the browser's user interface. Because React runs entirely on the client side, a technically savvy student can inspect the JavaScript bundle, open browser DevTools, or call the Firebase Firestore SDK/REST API directly with their auth token to send an `updateDoc` request on a menu item. What actually stops unauthorized changes is the server-side **`firestore.rules`** evaluated by Google's Firestore backend on every database request. Even if someone bypasses the React UI completely, Firestore checks `vendorOwner(vendorId) == request.auth.uid` on the server and rejects the write with a permission-denied error.
