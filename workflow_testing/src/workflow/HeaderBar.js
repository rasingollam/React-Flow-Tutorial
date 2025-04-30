import React from 'react';

// Styles for the header bar
const headerStyles = {
  padding: '5px 10px',
  borderBottom: '1px solid #ccc',
  background: '#ddd',
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
};

// Base style for buttons in the header
const baseButtonStyles = {
  background: 'none',
  border: '1px solid transparent',
  padding: '5px',
  cursor: 'pointer',
  borderRadius: '4px',
  lineHeight: '1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background-color 0.2s, border-color 0.2s',
  color: '#333',
};

// Style for buttons with icon and text (Add Stage, Add Task)
const iconTextButtonStyles = {
    ...baseButtonStyles,
    width: 'auto',
    gap: '5px',
    padding: '5px 8px',
    fontSize: '1em',
    fontWeight: 'normal',
};
const iconTextButtonIconStyle = {
    fontSize: '1.2em',
    lineHeight: '1',
};
const saveButtonSpecificStyles = { // Specific style for save button if needed
    ...iconTextButtonStyles,
    backgroundColor: '#28a745', // Green background
    color: 'white', // White text
    fontWeight: 'bold',
};
const saveButtonHoverStyles = { // Specific hover for save button
    backgroundColor: '#218838', // Darker green on hover
    borderColor: '#1e7e34',
};


// Hover style for buttons
const buttonHoverStyles = {
  backgroundColor: '#eee',
  borderColor: '#bbb',
};

// Style for icon buttons (controls like zoom, fit, lock)
const iconButtonStyles = {
  background: 'none',
  border: '1px solid transparent', // Transparent border initially
  padding: '5px',
  fontSize: '1.2em', // Adjusted size back slightly
  fontWeight: 'bold', // Make +/- bolder
  cursor: 'pointer',
  borderRadius: '4px',
  lineHeight: '1', // Ensure icon is centered vertically
  width: '35px', // Keep fixed width for icon-only buttons
  height: '35px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background-color 0.2s, border-color 0.2s',
  color: '#333', // Default color
};


function HeaderBar({
    onAddParentNode,
    onAddChildNode,
    selectedNodeId,
    onSaveWorkflow,
    isPanelOpen, // Add prop
    onToggleSidebar // Add prop
}) {
  // Simplified hover handlers
  const getButtonStyle = (e) => {
    // Apply general hover
    e.currentTarget.style.backgroundColor = buttonHoverStyles.backgroundColor;
    e.currentTarget.style.borderColor = buttonHoverStyles.borderColor;
  };
  const resetButtonStyle = (e) => {
    // Reset general style
    e.currentTarget.style.backgroundColor = iconTextButtonStyles.background; // Use base background
    e.currentTarget.style.borderColor = iconTextButtonStyles.border; // Use base border
  };

  // Specific hover for save button
   const getSaveButtonStyle = (e) => {
    e.currentTarget.style.backgroundColor = saveButtonHoverStyles.backgroundColor;
    e.currentTarget.style.borderColor = saveButtonHoverStyles.borderColor;
  };
  const resetSaveButtonStyle = (e) => {
    e.currentTarget.style.backgroundColor = saveButtonSpecificStyles.backgroundColor;
    e.currentTarget.style.borderColor = saveButtonSpecificStyles.border; // Use base border or specific one
  };


  return (
    <div style={headerStyles}>
      {/* Add Stage Button */}
      <button
        onClick={onAddParentNode}
        style={iconTextButtonStyles}
        onMouseEnter={getButtonStyle}
        onMouseLeave={resetButtonStyle}
        title="Add Stage (Parent Node)"
      >
        <span style={iconTextButtonIconStyle}>📦</span>
        Stage
      </button>

      {/* Add Task Button */}
      <button
        onClick={onAddChildNode}
        style={iconTextButtonStyles}
        onMouseEnter={getButtonStyle}
        onMouseLeave={resetButtonStyle}
        title={selectedNodeId ? 'Add Task to Selected' : 'Add Task (Child Node)'}
      >
        <span style={iconTextButtonIconStyle}>➕</span>
        Task
      </button>

      {/* Save Button - Remove marginLeft: 'auto' if toggle is last */}
      <button
        onClick={onSaveWorkflow}
        style={{...saveButtonSpecificStyles, marginLeft: 'auto'}} // Keep marginLeft: auto here
        onMouseEnter={getSaveButtonStyle}
        onMouseLeave={resetSaveButtonStyle}
        title="Save Workflow"
      >
        Save
      </button>

      {/* Separator before toggle */}
      <div style={{ borderLeft: '1px solid #bbb', height: '20px', margin: '0 5px' }}></div>

      {/* Toggle Sidebar Button */}
      <button
        onClick={onToggleSidebar}
        style={iconButtonStyles} // Use basic icon style
        onMouseEnter={getButtonStyle} // Use general hover
        onMouseLeave={resetButtonStyle} // Use general reset
        title={isPanelOpen ? "Hide Panel" : "Show Panel"}
      >
        {isPanelOpen ? '>' : '<'} {/* Arrow indicates action */}
      </button>

    </div>
  );
}

export default HeaderBar;
