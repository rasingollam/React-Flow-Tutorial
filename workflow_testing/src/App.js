import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'; // Removed BrowserRouter as Router
import './App.css';
import DesignWorkflowsWrapper from './workflow/DesignWorkflows'; // Import the design workflow component
import BpmnMainScreen from './bpmn-js/bpmn_main'; // Import the new BPMN screen

// Component for the Home Page content
function HomePage() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to the Workflow App</h1>
        <nav className="app-nav"> {/* Added a nav container */}
          <Link to="/design">
            <button className="modern-button">React Flow Designer</button>
          </Link>
          <Link to="/bpmn">
            <button className="modern-button">BPMN-JS Workflows</button>
          </Link>
        </nav>
      </header>
    </div>
  );
}

function App() {
  return (
    // <Router> removed from here
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/design" element={<DesignWorkflowsWrapper />} />
      <Route path="/bpmn" element={<BpmnMainScreen />} />
    </Routes>
    // </Router> removed from here
  );
}

export default App;
