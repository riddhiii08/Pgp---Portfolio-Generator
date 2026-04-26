# PortEdge - Comprehensive Project Documentation & Viva Guide

## 1. Project Overview
**Purpose**: PortEdge is a "No-Code" Portfolio Generator. It allows users (developers, designers, students) to enter their personal data, projects, and skills into a guided form and instantly generate a production-ready, fully responsive portfolio website or a professional one-page CV.

**Overall Flow**:
1. **Landing**: User arrives and sees features.
2. **Input**: User fills a 5-step form (Personal, Skills, Projects, Education, Contact).
3. **Template**: User selects a design style.
4. **Customize**: User tunes colors, fonts, and layouts.
5. **Finalize**: User previews the site and exports it as HTML, PDF, or a standard CV.

---

## 2. File-by-File Breakdown

### [1] index.html
- **Purpose**: The skeleton of the application. It contains the structure for all "Screens" (Landing, Form, Templates, Customize, Preview).
- **Contains**: HTML5 semantic tags, Navigation Bar, Multiple `<section>` elements for screens, and the Modal for previews.
- **Connections**: Links all CSS files and scripts. It is the "Stage" where the JavaScript swaps content.

### [2] js/state.js
- **Purpose**: The "Memory" of the app.
- **Functions**:
    - `save()`: Writes the current data to the browser's `localStorage` so it persists after refresh.
    - `get(path)` / `set(path, value)`: Helper functions to read or write specific variables (e.g., `personal.name`).
- **Connection**: Used by every other file to read or update user data.

### [3] js/app.js
- **Purpose**: The "Controller". Manages screen navigation and global app states.
- **Functions**:
    - `goTo(screenName)`: Swaps the visible screen by adding/removing CSS classes.
    - `renderFullPreview()`: Triggers the rendering engine and injects the result into the preview window.
- **Connection**: Listened to by virtually every button that changes the view.

### [4] js/form.js
- **Purpose**: Manages the data entry process.
- **Functions**:
    - `addProject()` / `addEducation()`: Dynamically creates new input cards for multiple projects or schools.
    - `nextSection()` / `prevSection()`: Manages the 5-step "Stepper" flow.
    - `validatePersonal()`: Ensures Name/Title are filled before proceeding.
- **Connection**: Updates `State` whenever a user types in a field.

### [5] js/customize.js
- **Purpose**: Handles the visual tuning.
- **Functions**:
    - `setAccent(color)`: Updates the primary color of the portfolio.
    - `setFont(font)`: Changes the typography.
    - `setLayout(layout)`: Toggles between Single-column, Two-column, or Grid views.
- **Connection**: Calls `Renderer.render()` whenever a style changes to show a real-time update.

### [6] js/renderer.js
- **Purpose**: The "Brain/Engine". This is the largest file. It contains the logic to turn raw data into a website.
- **Mechanism**: It uses "Template Strings" (HTML written inside JS backticks) to build a full HTML/CSS document dynamically.
- **Connection**: Provides the HTML used in the Preview and the final Download.

### [7] js/exporter.js
- **Purpose**: Handles the final output (HTML, PDF, CV).
- **Functions**:
    - `downloadHTML()`: Generates a blob and triggers a browser download.
    - `downloadPDF()`: Formats a modern, print-ready document.
    - `generateCV()`: **Crucial Function**. Creates a two-column, one-page professional resume without data truncation.
- **Connection**: Pulls final data from `State` to build the export files.

---

## 3. UI Elements & Logic (Viva Preparation)

| UI Element | File | Function Name | Step-by-Step Logic |
|:---|:---|:---|:---|
| **"Build My Portfolio" Button** | `index.html` | `App.goToForm()` | 1. Clicks button -> 2. Calls `goTo('form')` -> 3. Switches view to Step 1. |
| **"Add Project" Button** | `index.html` | `FormManager.addProject()` | 1. Creates new JS object -> 2. Injects new HTML card into form -> 3. Binds listeners to new inputs. |
| **"Preview" Tab/Button** | `index.html` | `App.renderFullPreview()` | 1. Fetches current state -> 2. Calls Renderer engine -> 3. Updates `iframe.srcdoc`. |
| **"Generate CV" Button** | `index.html` | `Exporter.generateCV()` | 1. Builds 2-column layout string -> 2. Opens new tab -> 3. Triggers browser `window.print()`. |
| **Color Swatches** | `customize.js`| `Customizer.setAccent()` | 1. Updates State -> 2. Rerenders preview instantly. |

---

## 4. Execution Flow (The Lifecycle)

1. **Initialization**: When the app starts, `State` loads data from `localStorage`. `App` detects which screen was last open and shows it.
2. **Interaction**: As the user types their Bio in `form.js`, `State.set('personal.bio', value)` is called immediately.
3. **Drafting**: When the user clicks "Next", the `FormManager` validates the step and moves the UI.
4. **Customization**: The user picks a font. `customize.js` tells the `Renderer` to rebuild the CSS part of the preview document.
5. **Final Output**: User clicks "Download". `Exporter` takes the *rendered* HTML, converts it into a "Blob" (Binary Large Object), and triggers the browser's download manager.

---

## 5. Technical Concepts Used
- **Vanilla JavaScript (ES6+)**: No external frameworks like React or Vue were used. This makes the app extremely fast and easy to host.
- **LocalStorage**: A browser feature that saves data locally.
- **IIFE (Immediately Invoked Function Expressions)**: The `const App = (() => { ... })();` pattern. This keeps code organized and prevents different files from crashing each other.
- **CSS Variables**: Used for the "Accent Color" logic, allowing one change in the UI to update the entire color scheme instantly.
- **Blob API**: Used to generate downloadable files directly from browser memory.
