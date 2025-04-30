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


// Hover style for buttons
const buttonHoverStyles = {
  backgroundColor: '#eee',
  borderColor: '#bbb',
};


function HeaderBar({
    onAddParentNode,
    onAddChildNode,
    selectedNodeId,
}) {
  // Simplified hover handlers
  const getButtonStyle = (e) => {
    e.currentTarget.style.backgroundColor = buttonHoverStyles.backgroundColor;
    e.currentTarget.style.borderColor = buttonHoverStyles.borderColor;
  };
  const resetButtonStyle = (e) => {
    e.currentTarget.style.backgroundColor = baseButtonStyles.background;
    e.currentTarget.style.borderColor = baseButtonStyles.border;
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

    </div>
  );
}

export default HeaderBar;
