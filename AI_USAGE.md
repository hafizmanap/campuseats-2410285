# AI usage log
## Week 1
- Tool(s): ChatGPT
- What I asked for: 
A simple counter component using React state and an introduction to JSX.
- What I kept, changed or rejected, and why: 
• Kept: The standard useState structure because it shows how to track the count.
• Changed: Modified the CSS classes applied to the buttons to match my project's global style guide instead of using the generic inline styles provided.
• Rejected: A complex useEffect hook that the AI automatically included to log the count, as it was unnecessary scope creep for a basic counter.
- One thing the AI got wrong and how I fixed it:
The AI at first mutated the state variable using count++ inside the click handler. I fixed this by using the proper setter function: setCount(prevCount => prevCount + 1).

## Week 2
- Tool(s): ChatGPT
- What I asked for:
An array mapping function to render a list of user profile cards from a JSON payload.
- What I kept, changed or rejected, and why: 
	• Kept: The dynamic .map() statement returning JSX elements, which saved me time writing boilerplate.
	• Changed: Extracted the inline mapping logic out into its own standalone <UserProfile /> component to keep the main file readable.
	• Rejected: The AI generated mock data structure because it didn't align with the actual keys (userId vs id) coming from my backend API.
- One thing the AI got wrong and how I fixed it:
The AI forgot to add a key prop to the top-level element inside the .map() loop, which cause a console warning. I fixed it by adding key={user.id} to the container.

## Week 3
- Tool(s): ChatGPT
- What I asked for:
Help to implement a shopping cart, fetching vendor data  from a mock API and create validation message in the checkout form.
- What I kept, changed or rejected, and why: 
	• Kept: The use of reduce() to calculate the cart quantity and total price because it made the calculations dynamic whenever items were added, removed, or updated.
	• Changed: Modifies the checkout form validation and error messages to match the required rules.
	• Rejected: An unnecessary way that stored the cart total in a separate state variable because the total could be calculated directly from the cart using reduce(), which can also avoids duplicated state.
- One thing the AI got wrong and how I fixed it:
The AI initially suggested updating the cart quantity without properly handling items whose quantity reached zero. I fixed this by updating the handleChangeQty() function so that items are automatically removed from the cart when their quantity reaches zero.

## Week 4
- Tool(s): ChatGPT
- What I asked for:
Help to implement custom hooks, local storage and react router.
- What I kept, changed or rejected, and why: 
	• Kept: The use of CartContext and CartProvider to manage cart data globally as no need to pass cart-related props through multiple components.
	• Changed: Refactored the existing vendor fetching logic into a custom useVendors() hook and moved cart functions into the cart context to make the code more organized.
	• Rejected: Keep the cart state only inside App.jsx because it would make sharing cart data between different pages more complicated. Instead, I used useLocalStorage to preserve cart data even after refreshing the browser.
- One thing the AI got wrong and how I fixed it:
The AI initially suggested using the cart context without checking whether a component was wrapped inside the CartProvider. This could cause errors when useCart() was called outside the provider. I fixed this by adding a clear error check inside the custom useCart() hook so that it throws an error if the context is accessed outside CartProvider.

# Week 1 reflection

1. What is the difference between building a UI imperatively (plain DOM code) and declaratively (React)?
• Imperative UI (Plain DOM): You must write step-by-step instructions telling the browser exactly how to change the UI (e.g., document.getElementById, createElement, appendChild). You manually manage state transitions and DOM updates.
• Declarative UI (React): You simply describe what the UI should look like based on the current state. React automatically handles the under-the-hood DOM updates to match that description whenever state changes.

2. Why must a component name start with capital letter?
• JSX element differentiation: React uses capitalization to distinguish between built-in HTML tags and custom components.
• HTML vs. Custom: A lowercase tag like <div> tells React to render a native HTML element. A capitalized tag like <Header /> tells React that it is a custom component that needs to be evaluated.

3. What does a fragment <>...</> do, and why not just a <div>?
• Group elements without layout baggage: A fragment lets you group multiple JSX elements together without adding an extra, unnecessary node to the real DOM.
• Why not a <div>: Using a <div> introduces an extra DOM layer. This can break CSS layouts (like Flexbox or Grid) and clutters the HTML tree needlessly.

4. Name one benefit of splitting the UI into small componenets?
• Reusability: You can write a component (like a Button or Card) once and safely reuse it across different parts of your application, saving time and keeping your codebase DRY (Don't Repeat Yourself).

## Week 5
- Tool(s): ChatGPT / Gemini
- What I asked for:
Help setting up Firebase Authentication with AuthContext and AuthProvider, creating LoginPage and updating my DailySpecial countdown feature to depend on the signed-in user.
- What I kept, changed or rejected, and why:
	• Kept: The onAuthStateChanged listener inside AuthProvider with its cleanup function and loading state so protected routes wait for Firebase before redirecting, as well as the per-user localStorage key pattern (ce-special-<uid>) for the daily special countdown.
	• Changed: Updated RegisterPage to validate that the display name is at least 3 characters before calling register(), and mapped Firebase error codes to user-friendly messages using authErrorMessage() instead of showing raw error codes.
	• Rejected: Storing Firebase API keys directly inside src/firebase.js, keeping them in .env.local with VITE_ prefixes instead so secrets are not committed to Git.
- One thing the AI got wrong and how I fixed it:
The AI initially checked if (!user) before checking if (loading) inside ProtectedRoute, which caused a brief flash of the login page whenever a signed-in user refreshed /cart or /orders. I fixed this by returning <Loading /> first while loading is true, and passing state={{ from: location.pathname }} on redirect so users return to their intended page after logging in.


## Week 6
- Tool(s): Gemini
- What I asked for:
Resolving Firestore permission errors during seeding, and migrating my Daily Special countdown from localStorage to a live Firestore Timestamp.
- What I kept, changed or rejected, and why:
	• Kept: The onSnapshot subscription patterns in vendors.js and orders.js, as well as the Timestamp conversion inside seedDemoData() so re-seeding preserves the specialEndsAt Timestamp automatically.
	• Changed: Updated DailySpecial.jsx to read specialEndsAt from inside the nested dailySpecial object (special.specialEndsAt) to match my existing NasiNova shop structure in vendors.json, and kept my existing CheckOutForm component naming.
	• Rejected: Creating a brand-new SpecialCountdown badge component from scratch, since I already had a working DailySpecial card component from Week 5 that only needed its localStorage timer swapped for Firestore.
- One thing the AI got wrong and how I fixed it:
The AI initially assumed special and specialEndsAt were stored at the top level of the vendor document (vendor.specialEndsAt), which caused my countdown to show "This daily special has ended" even though the date had not expired. I fixed this by sharing my vendors.json and DailySpecial.jsx structure so the code reads special.specialEndsAt inside the dailySpecial map and re-seeded Firestore.


## Week 7 
- Tool(s): Gemini / ChatGPT
- What I asked for: Help implementing real-time order status updates and daily special feature, handling Firestore data updates for my React application.
- What I kept, changed or rejected, and why:
    • Kept: The use of Firestore `onSnapshot()` to listen for real-time changes to order documents so that customers can see updated order statuses without refreshing the page.
    • Changed: Modified the order status display to use clear labels and visual indicators for each stage, such as Pending, Preparing, Ready for Pickup, and Complete. So, the order progress easier for users to understand.
    • Rejected: Fetching order data only once using `getDocs()` because it would not automatically reflect status changes made by the vendor. I preferred using real-time listeners to keep the order information up to date.
- One thing the AI got wrong and how I fixed it: The AI initially suggested setting up the Firestore `onSnapshot()` listener without properly cleaning it up when the component unmounted. This could cause unnecessary listeners and duplicate updates when navigating between pages. I fixed this by returning the unsubscribe function inside the `useEffect()` cleanup so that the listener is removed when the component unmounts or the order ID changes.