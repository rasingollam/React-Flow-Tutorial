import React from 'react';
import BpmnModelerComponent from './bpmn_components/BpmnModelerComponent'; // Import the modeler
import { Link } from 'react-router-dom'; // Optional: for a back button

// Styling for the main screen container
const screenContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  fontFamily: 'Arial, sans-serif',
  backgroundColor: '#f0f2f5', // Light background for the overall page
};

const headerStyle = {
  padding: '10px 20px',
  backgroundColor: '#fff', // White header
  borderBottom: '1px solid #ccc',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between', // For title and potential actions
};

const titleStyle = {
  fontSize: '1.5em', // Adjusted size
  color: '#333',
  margin: 0, // Remove default margin
};

const modelerWrapperStyle = {
  flexGrow: 1, // Allow the modeler to take up remaining space
  display: 'flex', // To center the modeler component if it's smaller
  justifyContent: 'center',
  alignItems: 'center',
  padding: '10px', // Padding around the modeler
  overflow: 'hidden', // Prevent scrollbars on this wrapper
};

function BpmnMainScreen() {
  return (
    <div style={screenContainerStyle}>
      <header style={headerStyle}>
        <h1 style={titleStyle}>BPMN-JS Workflow Designer</h1>
        {/* You can add save/load buttons here later, passing callbacks to BpmnModelerComponent */}
        <Link to="/" style={{ textDecoration: 'none', color: '#007bff', fontWeight: '500' }}>
          Back to Home
        </Link>
      </header>
      <main style={modelerWrapperStyle}>
        <BpmnModelerComponent />
      </main>
    </div>
  );
}

export default BpmnMainScreen;
