import React, { useState, useEffect } from 'react';

// Styles moved or adapted from DesignWorkflows
const sidebarStyles = {
  width: '300px', // Adjust width as needed
  padding: '10px',
  borderLeft: '1px solid #ccc',
  background: '#eee',
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  overflowY: 'auto', // Allow scrolling if content exceeds height
};
const buttonStyles = { marginRight: '10px', marginBottom: '10px' }; // Added marginBottom
const inputStyles = { width: '60px', marginLeft: '5px' };
const renameInputStyles = { width: '150px', marginLeft: '5px' };
const deleteButtonStyle = {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '10px',
};
const connectionListStyle = { marginTop: '10px', borderTop: '1px solid #ddd', paddingTop: '10px' };
const connectionItemStyle = { marginBottom: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const connectionTextStyle = { fontSize: '12px', marginRight: '10px' };
const sectionStyle = { borderBottom: '1px solid #ddd', paddingBottom: '15px' };

function ControlPanel({
  selectedNode, // Pass the whole selected node object
  selectedEdgeId,
  selectedNodeConnections,
  onAddParentNode,
  onAddChildNode,
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


  return (
    <div style={sidebarStyles}>
      {/* Node Creation Section */}
      <div style={sectionStyle}>
        <strong>Create Nodes</strong>
        <div>
            <button onClick={onAddParentNode} style={buttonStyles}>Add Stage</button>
            <button onClick={onAddChildNode} style={buttonStyles}>
            {selectedNodeId ? 'Add Task to Selected' : 'Add Task'}
            </button>
        </div>
      </div>

      {/* Node Edit Section */}
      {selectedNodeId && (
        <div style={sectionStyle}>
          <strong>Edit Node ({selectedNodeId})</strong>
          {/* Rename Controls */}
          <div>
            <span>Rename:</span>
            <input
              type="text"
              value={renameInput}
              onChange={(e) => setRenameInput(e.target.value)}
              style={renameInputStyles}
            />
            <button onClick={handleRename} style={{ marginLeft: '5px' }}>Apply</button>
          </div>

          {/* Resize Controls */}
          {selectedNodeIsGroup && (
            <div style={{ marginTop: '10px' }}>
              <span>Resize Stage:</span>
              <label> W:
                <input
                  type="number"
                  value={widthInput}
                  onChange={(e) => setWidthInput(e.target.value)}
                  style={inputStyles}
                  min="10"
                />
              </label>
              <label> H:
                <input
                  type="number"
                  value={heightInput}
                  onChange={(e) => setHeightInput(e.target.value)}
                  style={inputStyles}
                  min="10"
                />
              </label>
              <button onClick={handleResize} style={{ marginLeft: '5px' }}>Apply</button>
            </div>
          )}

          {/* Connections List */}
          {!selectedNodeIsGroup && selectedNodeConnections.length > 0 && (
            <div style={connectionListStyle}>
              <strong>Connections:</strong>
              {selectedNodeConnections.map(edge => (
                <div key={edge.id} style={connectionItemStyle}>
                  <span style={connectionTextStyle}>
                    {edge.source === selectedNodeId ? `➡️ To: ${edge.target}` : `⬅️ From: ${edge.source}`}
                  </span>
                  <button
                    onClick={() => onDeleteSpecificEdge(edge.id)}
                    style={{ ...deleteButtonStyle, marginLeft: 'auto', padding: '2px 5px', fontSize: '10px' }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
          {!selectedNodeIsGroup && selectedNodeConnections.length === 0 && (
               <div style={connectionListStyle}>
                  <span style={{fontSize: '12px', fontStyle: 'italic'}}>No connections</span>
               </div>
           )}

           {/* Delete Node Button */}
           <div style={{ marginTop: '15px', borderTop: '1px solid #ddd', paddingTop: '15px' }}>
             <button onClick={handleDeleteNodeClick} style={{...deleteButtonStyle, marginLeft: 0}}>
                Delete Node ({selectedNodeId})
             </button>
           </div>
        </div>
      )}

      {/* Edge Edit Section */}
      {selectedEdgeId && (
         <div style={sectionStyle}>
            <strong>Edit Connection</strong>
            <div>
                <span>Selected: {selectedEdgeId}</span>
                <button onClick={handleDeleteEdgeClick} style={deleteButtonStyle}>
                    Delete Connection
                </button>
            </div>
         </div>
      )}

      {/* Status Text */}
      {!selectedNodeId && !selectedEdgeId && <span style={{ marginTop: 'auto', fontStyle: 'italic', color: '#666' }}>Select an element to edit</span>}
    </div>
  );
}

export default ControlPanel;
