import React, { useRef } from 'react';

// --- Updated Header Styles ---

const headerStyles = {
  padding: '8px 16px', // Adjusted padding
  borderBottom: '1px solid #e0e0e0', // Lighter border
  background: '#ffffff', // White background
  display: 'flex',
  alignItems: 'center',
  gap: '8px', // Consistent gap
  fontFamily: 'Arial, sans-serif', // Match ControlPanel font
};

// Base style for all buttons in the header
const baseButtonStyles = {
  display: 'inline-flex', // Use inline-flex for icon/text alignment
  alignItems: 'center',
  justifyContent: 'center',
  padding: '6px 12px', // Adjusted padding
  border: '1px solid #ccc', // Default border
  borderRadius: '4px',
  fontSize: '13px', // Consistent font size
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'background-color 0.2s, border-color 0.2s, color 0.2s',
  backgroundColor: '#ffffff', // Default background
  color: '#333', // Default text color
  whiteSpace: 'nowrap', // Prevent text wrapping
};

// Style for buttons with icon and text (Add Stage, Add Task)
const iconTextButtonStyles = {
    ...baseButtonStyles,
    gap: '6px', // Gap between icon and text
};
const iconTextButtonIconStyle = {
    fontSize: '1.1em', // Slightly larger icon
    lineHeight: '1',
};

// Style for icon-only buttons (Toggle Sidebar)
const iconButtonStyles = {
    ...baseButtonStyles,
    width: '32px', // Fixed size for icon buttons
    height: '32px',
    padding: '0', // Remove padding for icon-only
    fontSize: '1.2em', // Icon size
};

// Specific styles for action buttons (Open, Save)
const actionButtonStyle = {
    ...iconTextButtonStyles, // Based on icon-text style
    fontWeight: '600',
};

const openButtonStyle = {
    ...actionButtonStyle,
    marginLeft: 'auto', // Push Open/Save group to the right
    borderColor: '#6c757d',
    color: '#343a40',
};
const openButtonHoverStyle = {
    backgroundColor: '#f8f9fa',
    borderColor: '#5a6268',
};

const saveButtonStyle = {
    ...actionButtonStyle,
    backgroundColor: '#28a745',
    borderColor: '#28a745',
    color: 'white',
};
const saveButtonHoverStyle = {
    backgroundColor: '#218838',
    borderColor: '#1e7e34',
};

// Hover for default buttons
const defaultButtonHoverStyle = {
    backgroundColor: '#f8f9fa', // Lighter background on hover
    borderColor: '#adb5bd',
};

// --- Component ---

function HeaderBar({
    onAddParentNode,
    onAddChildNode,
    selectedNodeId,
    onSaveWorkflow,
    isPanelOpen,
    onToggleSidebar,
    onOpenFile,
}) {
  const fileInputRef = useRef(null);

  // Generic hover handlers using base styles
  const addHover = (e, hoverStyle) => {
      Object.assign(e.currentTarget.style, hoverStyle);
  };
  const removeHover = (e, baseStyle) => {
      // Ensure baseStyle includes all properties being changed by hoverStyle
      // This might need refinement if hover styles change more than bg/border
      e.currentTarget.style.backgroundColor = baseStyle.backgroundColor || baseButtonStyles.backgroundColor;
      e.currentTarget.style.borderColor = baseStyle.borderColor || baseButtonStyles.borderColor;
      e.currentTarget.style.color = baseStyle.color || baseButtonStyles.color;
  };

  const handleOpenClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      onOpenFile(file);
    }
    // Reset file input value to allow opening the same file again
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div style={headerStyles}>
      {/* Add Stage Button */}
      <button
        onClick={onAddParentNode}
        style={iconTextButtonStyles}
        onMouseEnter={(e) => addHover(e, defaultButtonHoverStyle)}
        onMouseLeave={(e) => removeHover(e, iconTextButtonStyles)}
        title="Add Stage (Parent Node)"
      >
        <span style={iconTextButtonIconStyle}>📦</span>
        <span>Stage</span> {/* Wrap text in span for consistency */}
      </button>

      {/* Add Task Button */}
      <button
        onClick={onAddChildNode}
        style={iconTextButtonStyles}
        onMouseEnter={(e) => addHover(e, defaultButtonHoverStyle)}
        onMouseLeave={(e) => removeHover(e, iconTextButtonStyles)}
        title={selectedNodeId ? 'Add Task to Selected' : 'Add Task (Child Node)'}
      >
        <span style={iconTextButtonIconStyle}>➕</span>
        <span>Task</span> {/* Wrap text in span */}
      </button>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".json,application/json" // Accept only JSON files
        onChange={handleFileChange}
      />

      {/* Open Button */}
      <button
        onClick={handleOpenClick}
        style={openButtonStyle}
        onMouseEnter={(e) => addHover(e, openButtonHoverStyle)}
        onMouseLeave={(e) => removeHover(e, openButtonStyle)}
        title="Open Workflow File"
      >
        {/* <span style={iconTextButtonIconStyle}>📂</span> */}
        <span>Open</span>
      </button>

      {/* Save Button */}
      <button
        onClick={onSaveWorkflow}
        style={saveButtonStyle}
        onMouseEnter={(e) => addHover(e, saveButtonHoverStyle)}
        onMouseLeave={(e) => removeHover(e, saveButtonStyle)}
        title="Save Workflow"
      >
        {/* <span style={iconTextButtonIconStyle}>💾</span> */}
        <span>Save</span>
      </button>

      {/* Separator (Optional but helps visually) */}
      <div style={{ borderLeft: '1px solid #e0e0e0', height: '20px', margin: '0 4px' }}></div>

      {/* Toggle Sidebar Button */}
      <button
        onClick={onToggleSidebar}
        style={iconButtonStyles} // Use icon-only style
        onMouseEnter={(e) => addHover(e, defaultButtonHoverStyle)}
        onMouseLeave={(e) => removeHover(e, iconButtonStyles)}
        title={isPanelOpen ? "Hide Panel" : "Show Panel"}
      >
        {/* Use slightly different arrows */}
        {isPanelOpen ? '»' : '«'}
      </button>

    </div>
  );
}

export default HeaderBar;
