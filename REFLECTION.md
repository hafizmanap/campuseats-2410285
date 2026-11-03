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