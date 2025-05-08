# 🎨 Workflow Designer - React Flow & BPMN-JS Practice Project

![React Flow Logo](https://reactflow.dev/img/logo.svg) ![BPMN.IO Logo](https://bpmn.io/assets/logo.svg)

A practice project demonstrating the capabilities of:
1.  **[React Flow](https://reactflow.dev/)**: To build an interactive workflow diagram editor. Create, connect, modify, save, and load workflow diagrams with stages (groups) and tasks (nodes).
2.  **[BPMN-JS](https://bpmn.io/)**: To build a BPMN 2.0 compliant workflow modeler. Create, modify, and manage BPMN diagrams with custom attributes, and save/load them.

---

## ✨ Features

### React Flow Designer
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

### BPMN-JS Workflow Modeler
*   **BPMN 2.0 Modeling:**
    *   🛠️ Create and modify standard BPMN 2.0 elements (Tasks, Events, Gateways, Flows, etc.).
    *   🖱️ Standard BPMN-JS palette and modeling interactions.
*   **Custom Attributes:**
    *   📝 **Define Schemas:** A modal to define custom attribute schemas (name, label, data type) for various BPMN element types. Supported types: text, number, date, boolean, url, email, document.
    *   🛡️ **Reserved Name Prevention:** Prevents defining custom attributes with names that conflict with standard BPMN properties.
    *   🎨 **Properties Panel:** Dynamically displays input fields for defined custom attributes for the selected BPMN element.
    *   💾 **Apply Attributes:** Save custom attribute values to the BPMN element's business object.
*   **Persistence:**
    *   💾 **Save Diagram & Attributes:** Download the current BPMN diagram (XML) and its associated custom attribute schemas as a single `workflow_with_attributes.bpmn.json` file.
    *   📂 **Import Diagram & Attributes:** Load a previously saved `.bpmn.json` file, restoring both the BPMN diagram and the custom attribute schemas.
*   **Visuals:**
    *   🎨 Standard BPMN-JS rendering.
    *   🖌️ UI for schema definition and custom properties panel.

---

## 🛠️ Tech Stack

*   **[React](https://reactjs.org/)**: Frontend library for building user interfaces.
*   **[@xyflow/react (React Flow)](https://reactflow.dev/)**: Library for node-based editors and interactive diagrams.
*   **[BPMN-JS](https://bpmn.io/toolkit/bpmn-js/)**: BPMN 2.0 rendering and modeling toolkit.
*   **[JavaScript (ES6+)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)**: Core programming language.
*   **[CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)**: Styling (using inline styles and CSS files).
*   **[React Router](https://reactrouter.com/)**: For handling navigation.

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

### General
1.  The application opens to a home page with navigation to the two designers.

### React Flow Designer
1.  Navigate to the `/design` route (Click the "React Flow Designer" button on the home page).
2.  Use the **"Stage"** and **"Task"** buttons in the header to add nodes.
3.  Click on a Stage node before clicking "Task" to add a child task inside it.
4.  Click and drag from the handles (small circles) on Task nodes to create connections (edges).
5.  Select a node or edge to view its details and editing options in the right-hand **Control Panel**.
6.  Use the **"Open"** button to load a `.json` file containing a previously saved workflow.
7.  Use the **"Save"** button to download the current state of your workflow as a `.json` file.
8.  Use the **`»` / `«`** button to toggle the visibility of the Control Panel.
9.  Use the default controls in the bottom-left corner to zoom, pan, and fit the view.

### BPMN-JS Workflow Modeler
1.  Navigate to the `/bpmn` route (Click the "BPMN-JS Workflows" button on the home page).
2.  Use the BPMN palette on the left to add elements to the canvas.
3.  Click **"Define Custom Attributes"**:
    *   Select a BPMN element type from the dropdown.
    *   Add new attributes by specifying a unique name, display label, data type, and optional placeholder.
    *   Click "Add Attribute to List".
    *   Click "Save Definitions for [ElementType]" to save the schema for that type.
    *   Repeat for other element types as needed.
4.  Select a BPMN element on the canvas. The **Properties Panel** on the right will show:
    *   Standard BPMN properties (read-only in this custom panel).
    *   A "Custom Attributes for [ElementType]" section if a schema is defined for that element type.
    *   Input fields for each defined custom attribute.
    *   A "Raw Business Object" view for inspection.
5.  Modify custom attribute values and click **"Apply Custom Attributes"** to save them to the element.
6.  Use the **"Import Diagram"** button to load a `.bpmn.json` file containing a previously saved BPMN diagram and its attribute schemas.
7.  Use the **"Save Diagram"** button to download the current BPMN diagram and its attribute schemas as a `.bpmn.json` file.

---

## 📁 Project Structure (Key Components)

```
src/
├── workflow/                 # React Flow Designer components
│   ├── ControlPanel.js
│   ├── CustomGroupNode.js
│   ├── DesignWorkflows.js
│   └── HeaderBar.js
├── bpmn-js/                  # BPMN-JS Designer components
│   ├── bpmn_main.js          # Main screen/container for BPMN designer
│   └── bpmn_components/
│       ├── BpmnModelerComponent.js # Core BPMN-JS modeler setup and logic
│       ├── CustomBpmnPropertiesPanel.js # Panel for custom attributes
│       └── SchemaDefinitionModal.js   # Modal for defining attribute schemas
├── App.css
├── App.js
└── index.js
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
