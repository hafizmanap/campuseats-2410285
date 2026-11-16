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
