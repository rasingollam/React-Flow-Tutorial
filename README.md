# 🎨 Workflow Designer - React Flow Practice Project

![React Flow Logo](https://reactflow.dev/img/logo.svg)

A practice project demonstrating the capabilities of the [React Flow](https://reactflow.dev/) library to build an interactive workflow diagram editor. Create, connect, modify, save, and load workflow diagrams with stages (groups) and tasks (nodes).

---

## ✨ Features

*   **Add Elements:**
    *   📦 Add "Stage" nodes (Group nodes).
    *   ➕ Add "Task" nodes (Default nodes).
    *   🖱️ Add Tasks inside selected Stages (Parenting).
*   **Connections:**
    *   🔗 Drag handles to connect Task nodes.
*   **Editing Panel:**
    *   ✏️ Rename selected nodes (Stages or Tasks).
    *   ↔️ Resize selected Stage nodes (Width & Height).
    *   🗑️ Delete selected nodes or edges.
    *   ⛓️ View and delete connections for a selected Task node.
    *   ↔️ Toggle sidebar visibility.
*   **Canvas Controls:**
    *   ➕ Zoom In / ➖ Zoom Out /  फिट Fit View (Default React Flow Controls).
    *   🔒 Lock/Unlock canvas interactions (Default React Flow Controls).
    *   🖱️ Pan and zoom the canvas.
*   **Persistence:**
    *   💾 **Save:** Download the current workflow (nodes, edges, viewport) as a `workflow.json` file.
    *   📂 **Open:** Load a previously saved `workflow.json` file onto the canvas.
*   **Visuals:**
    *   🎨 Custom styling for nodes, including highlighting selected nodes.
    *   🖌️ Modern UI for the header bar and control panel.
    *   🌐 Background pattern for the canvas.

---

## 🛠️ Tech Stack

*   **[React](https://reactjs.org/)**: Frontend library for building user interfaces.
*   **[@xyflow/react (React Flow)](https://reactflow.dev/)**: Library for node-based editors and interactive diagrams.
*   **[JavaScript (ES6+)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)**: Core programming language.
*   **[CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)**: Styling (using inline styles and CSS files).
*   **[React Router](https://reactrouter.com/)**: For handling navigation (basic setup shown in `App.js`).

---

## 🚀 Getting Started

Follow these steps to get the project running locally:

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd React-Flow-Tutorial # Or your project directory name
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Run the development server:**
    ```bash
    npm start
    # or
    yarn start
    ```
4.  Open your browser and navigate to `http://localhost:3000` (or the port specified).

---

## 🕹️ Usage

1.  Navigate to the `/design` route (Click the "Open Designer" button on the home page).
2.  Use the **"Stage"** and **"Task"** buttons in the header to add nodes.
3.  Click on a Stage node before clicking "Task" to add a child task inside it.
4.  Click and drag from the handles (small circles) on Task nodes to create connections (edges).
5.  Select a node or edge to view its details and editing options in the right-hand **Control Panel**.
6.  Use the **"Open"** button to load a `.json` file containing a previously saved workflow.
7.  Use the **"Save"** button to download the current state of your workflow as a `.json` file.
8.  Use the **`»` / `«`** button to toggle the visibility of the Control Panel.
9.  Use the default controls in the bottom-left corner to zoom, pan, and fit the view.

---

## 📁 Project Structure (Key Components)

```
src/
├── workflow/
│   ├── ControlPanel.js     # Sidebar for editing selected elements
│   ├── CustomGroupNode.js  # Custom component for Stage nodes
│   ├── DesignWorkflows.js  # Main component housing React Flow and logic
│   └── HeaderBar.js        # Top bar with action buttons (Add, Save, Open, etc.)
├── App.css                 # Basic CSS styling
├── App.js                  # Main application component (routing setup)
└── index.js                # Entry point
```

---

## 🤝 Contributing (Example)

Contributions are welcome! If you have suggestions or find bugs, please open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License (Example)

Distributed under the MIT License. See `LICENSE` file for more information (if one exists).

---

*This project was created as a learning exercise for React Flow.*
