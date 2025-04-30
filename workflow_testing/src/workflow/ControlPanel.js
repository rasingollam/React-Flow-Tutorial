import React, { useState, useEffect } from 'react';

// --- Updated Styles ---

const sidebarStyles = {
  width: '300px',
  padding: '16px', // Increased padding
  borderLeft: '1px solid #e0e0e0', // Lighter border
  background: '#f9f9f9', // Lighter background
  display: 'flex',
  flexDirection: 'column',
  gap: '20px', // Increased gap between sections
  overflowY: 'auto',
  fontFamily: 'Arial, sans-serif', // Example font stack
  color: '#333', // Default text color
};

const sectionStyle = {
  paddingBottom: '20px', // Increased padding
  borderBottom: '1px solid #eee', // Lighter border
};

const sectionTitleStyle = {
  fontSize: '14px',
  fontWeight: '600', // Semi-bold
  color: '#555',
  marginBottom: '12px', // Space below title
  textTransform: 'uppercase', // Uppercase title
  letterSpacing: '0.5px',
};

const labelStyle = {
    display: 'block', // Ensure labels take full width
    fontSize: '13px',
    color: '#666',
    marginBottom: '4px',
};

const inputBaseStyles = {
    width: '100%', // Make inputs take full width
    padding: '8px 10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box', // Include padding and border in width
    marginBottom: '10px', // Space below inputs
};

const inputStyles = { // For numeric inputs (W/H)
    ...inputBaseStyles,
    width: '70px', // Specific width for W/H
    marginLeft: '5px',
    marginRight: '10px',
    marginBottom: 0, // Remove bottom margin when inline
};

const renameInputStyles = { // For rename input
    ...inputBaseStyles,
};

const buttonBaseStyles = {
    padding: '8px 15px',
    border: '1px solid transparent',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s, border-color 0.2s, color 0.2s',
    marginRight: '8px', // Default margin
};

const primaryButtonStyle = { // For 'Apply' buttons
    ...buttonBaseStyles,
    backgroundColor: '#007bff',
    color: 'white',
    borderColor: '#007bff',
};
const primaryButtonHoverStyle = {
    backgroundColor: '#0056b3',
    borderColor: '#0056b3',
};

const deleteButtonStyle = { // For 'Delete' buttons
    ...buttonBaseStyles,
    backgroundColor: '#dc3545',
    color: 'white',
    borderColor: '#dc3545',
    marginLeft: 'auto', // Push delete buttons to the right where applicable
};
const deleteButtonHoverStyle = {
    backgroundColor: '#c82333',
    borderColor: '#bd2130',
};

const smallDeleteButtonStyle = { // For connection list delete
    ...deleteButtonStyle,
    padding: '3px 8px',
    fontSize: '11px',
    marginLeft: 'auto',
};

const connectionListStyle = {
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: '1px solid #eee',
};

const connectionItemStyle = {
    marginBottom: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px',
    color: '#444',
};

const connectionTextStyle = {
    marginRight: '10px',
};

const inlineGroupStyle = { // For grouping label and input inline (like W/H)
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
};

const statusTextStyle = {
    marginTop: 'auto', // Push to bottom
    paddingTop: '20px', // Space above
    fontSize: '13px',
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
};


function ControlPanel({
  selectedNode,
  selectedEdgeId,
  selectedNodeConnections,
  onRenameNode,
  onResizeNode,
  onDeleteNode,
  onDeleteEdge,
  onDeleteSpecificEdge,
}) {
  // Manage input states locally within the control panel
  const [renameInput, setRenameInput] = useState('');
  const [widthInput, setWidthInput] = useState('');
  const [heightInput, setHeightInput] = useState('');

  const selectedNodeId = selectedNode?.id;
  const selectedNodeIsGroup = selectedNode?.type === 'group';

  // Effect to update local input states when the selected node changes
  useEffect(() => {
    if (selectedNode) {
      setRenameInput(selectedNode.data?.label || '');
      if (selectedNode.type === 'group') {
        setWidthInput(selectedNode.style?.width || '');
        setHeightInput(selectedNode.style?.height || '');
      } else {
        setWidthInput('');
        setHeightInput('');
      }
    } else {
      // Clear inputs if no node is selected
      setRenameInput('');
      setWidthInput('');
      setHeightInput('');
    }
  }, [selectedNode]); // Depend on the selectedNode object

  const handleRename = () => {
    if (selectedNodeId) {
      onRenameNode(selectedNodeId, renameInput);
    }
  };

  const handleResize = () => {
    if (selectedNodeId && selectedNodeIsGroup) {
      onResizeNode(selectedNodeId, widthInput, heightInput);
    }
  };

  const handleDeleteNodeClick = () => {
    if (selectedNodeId) {
      onDeleteNode(selectedNodeId);
    }
  };

  const handleDeleteEdgeClick = () => {
    if (selectedEdgeId) {
      onDeleteEdge(selectedEdgeId);
    }
  };

  // Inline hover handlers (consider CSS classes for larger apps)
  const addHover = (e, hoverStyle) => {
      Object.assign(e.currentTarget.style, hoverStyle);
  };
  const removeHover = (e, baseStyle) => {
      Object.assign(e.currentTarget.style, baseStyle);
  };


  return (
    <div style={sidebarStyles}>
      {/* Node Edit Section */}
      {selectedNodeId && (
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Edit Node ({selectedNodeId})</div>

          {/* Rename Controls */}
          <div>
            <label style={labelStyle} htmlFor={`rename-${selectedNodeId}`}>Name:</label>
            <input
              id={`rename-${selectedNodeId}`}
              type="text"
              value={renameInput}
              onChange={(e) => setRenameInput(e.target.value)}
              style={renameInputStyles}
            />
            <button
                onClick={handleRename}
                style={primaryButtonStyle}
                onMouseEnter={(e) => addHover(e, primaryButtonHoverStyle)}
                onMouseLeave={(e) => removeHover(e, primaryButtonStyle)}
            >
                Apply Name
            </button>
          </div>

          {/* Resize Controls */}
          {selectedNodeIsGroup && (
            <div style={{ marginTop: '15px' }}>
              <label style={labelStyle}>Size (W x H):</label>
              <div style={inlineGroupStyle}>
                 <input
                    type="number"
                    value={widthInput}
                    onChange={(e) => setWidthInput(e.target.value)}
                    style={inputStyles}
                    min="10"
                    aria-label="Width"
                  />
                 <input
                    type="number"
                    value={heightInput}
                    onChange={(e) => setHeightInput(e.target.value)}
                    style={inputStyles}
                    min="10"
                    aria-label="Height"
                  />
                 <button
                    onClick={handleResize}
                    style={primaryButtonStyle}
                    onMouseEnter={(e) => addHover(e, primaryButtonHoverStyle)}
                    onMouseLeave={(e) => removeHover(e, primaryButtonStyle)}
                 >
                    Apply Size
                 </button>
              </div>
            </div>
          )}

          {/* Connections List */}
          {!selectedNodeIsGroup && (
            <div style={connectionListStyle}> {/* Parent div for the whole connection section */}
              <div style={{...labelStyle, marginBottom: '8px'}}>Connections:</div>
              {selectedNodeConnections.length > 0 ? (
                // Map over connections if they exist
                selectedNodeConnections.map(edge => (
                  <div key={edge.id} style={connectionItemStyle}> {/* Each connection item */}
                    <span style={connectionTextStyle}>
                      {edge.source === selectedNodeId ? `➡️ To: ${edge.target}` : `⬅️ From: ${edge.source}`}
                    </span>
                    <button
                      onClick={() => onDeleteSpecificEdge(edge.id)}
                      style={smallDeleteButtonStyle}
                      onMouseEnter={(e) => addHover(e, deleteButtonHoverStyle)}
                      onMouseLeave={(e) => removeHover(e, smallDeleteButtonStyle)}
                    >
                      Delete
                    </button>
                  </div> // Close connection item div
                )) // End map
              ) : (
                // Display "No connections" if array is empty
                 <span style={{...connectionTextStyle, fontStyle: 'italic', color: '#888'}}>No connections</span>
              )} {/* End ternary */}
            </div> // Close parent connection section div
           )} {/* End !selectedNodeIsGroup check */}

           {/* Delete Node Button */}
           <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
             <button
                onClick={handleDeleteNodeClick}
                style={{...deleteButtonStyle, marginLeft: 0}} // Override margin for this specific button
                onMouseEnter={(e) => addHover(e, deleteButtonHoverStyle)}
                onMouseLeave={(e) => removeHover(e, {...deleteButtonStyle, marginLeft: 0})}
             >
                Delete Node ({selectedNodeId}) {/* Text moved inside button */}
             </button> {/* Corrected closing tag */}
           </div>
        </div> // Close Node Edit Section div
      )}

      {/* Edge Edit Section */}
      {selectedEdgeId && (
         <div style={sectionStyle}>
            <div style={sectionTitleStyle}>Edit Connection</div>
            <div style={inlineGroupStyle}>
                <span style={{...labelStyle, marginBottom: 0, marginRight: '10px'}}>ID: {selectedEdgeId}</span>
                <button
                    onClick={handleDeleteEdgeClick}
                    style={deleteButtonStyle}
                    onMouseEnter={(e) => addHover(e, deleteButtonHoverStyle)}
                    onMouseLeave={(e) => removeHover(e, deleteButtonStyle)}
                >
                    Delete Connection
                </button>
            </div>
         </div>
      )}

      {/* Status Text */}
      {!selectedNodeId && !selectedEdgeId && <span style={statusTextStyle}>Select an element to edit</span>}
    </div> // Close main sidebar div
  );
}

export default ControlPanel;
