import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import CustomGroupNode from './CustomGroupNode';

// Basic styling for the container and toolbar
const containerStyles = { height: '100vh', width: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }; // Added position: relative
const toolbarStyles = { padding: '10px', borderBottom: '1px solid #ccc', background: '#eee', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' };
const buttonStyles = { marginRight: '10px' };
const inputStyles = { width: '60px', marginLeft: '5px' };
const renameInputStyles = { width: '150px', marginLeft: '5px' };
const flowStyles = { flexGrow: 1 };
const rfStyle = {
  backgroundColor: '#f0f0f0',
};
// Styles for the save button container and button
const saveButtonContainerStyles = {
  position: 'absolute',
  right: '20px',
  bottom: '20px',
  zIndex: 10, // Ensure it's above the ReactFlow component
};
const saveButtonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  cursor: 'pointer',
  backgroundColor: '#28a745', // Green color
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
};
const deleteButtonStyle = {
    backgroundColor: '#dc3545', // Red color
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


// Counters for unique node/edge IDs
let stageIdCounter = 0;
let taskIdCounter = 0;
let edgeIdCounter = 0; // Counter for custom edge IDs

// Modified getId function
const getId = (type) => {
  switch (type) {
    case 'group':
      return `Stage_${stageIdCounter++}`;
    case 'task':
    default: // Default to task prefix if type is missing or different
      return `Task_${taskIdCounter++}`;
  }
};

// Function to get a unique edge ID
const getEdgeId = () => `Connection_${edgeIdCounter++}`;


// Define the custom node types
const nodeTypes = {
  group: CustomGroupNode,
};

function DesignWorkflows() {
  // Initialize with empty arrays
  const [nodes, setNodes] = useState([]); // Initialize with empty array
  const [edges, setEdges] = useState([]); // Initialize with empty array
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [selectedNodeIsGroup, setSelectedNodeIsGroup] = useState(false);
  const [widthInput, setWidthInput] = useState('');
  const [heightInput, setHeightInput] = useState('');
  const [renameInput, setRenameInput] = useState('');
  const reactFlowWrapper = useRef(null);


  // Effect to update UI state based on the currently selected elements
  useEffect(() => {
    // Check for selected node
    const currentlySelectedNode = nodes.find(node => node.selected);
    console.log("Effect running. Found selected node:", currentlySelectedNode?.id);

    if (currentlySelectedNode) {
      setSelectedNodeId(currentlySelectedNode.id);
      setSelectedEdgeId(null); // Deselect edge if node is selected
      console.log("Selected Node Object:", currentlySelectedNode);
      const currentLabel = currentlySelectedNode.data?.label || '';
      console.log("Setting rename input to:", currentLabel);
      setRenameInput(currentLabel);

      if (currentlySelectedNode.type === 'group') {
        setSelectedNodeIsGroup(true);
        setWidthInput(currentlySelectedNode.style?.width || '');
        setHeightInput(currentlySelectedNode.style?.height || '');
      } else {
        setSelectedNodeIsGroup(false);
        setWidthInput('');
        setHeightInput('');
      }
    } else {
      // If no node selected, check for selected edge
      const currentlySelectedEdge = edges.find(edge => edge.selected);
      console.log("Effect running. Found selected edge:", currentlySelectedEdge?.id);

      if (currentlySelectedEdge) {
        setSelectedEdgeId(currentlySelectedEdge.id);
        setSelectedNodeId(null); // Deselect node if edge is selected
        // Clear node-specific inputs
        setSelectedNodeIsGroup(false);
        setWidthInput('');
        setHeightInput('');
        setRenameInput('');
      } else {
        // No node or edge selected
        console.log("No node or edge selected, clearing inputs.");
        setSelectedNodeId(null);
        setSelectedEdgeId(null);
        setSelectedNodeIsGroup(false);
        setWidthInput('');
        setHeightInput('');
        setRenameInput('');
      }
    }
  // Depend on both nodes and edges arrays for selection changes
  }, [nodes, edges]);


  // Simplified onNodesChange - let applyNodeChanges handle selection flags
  const onNodesChange = useCallback(
    (changes) => {
      console.log("onNodesChange received changes:", changes);
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );

  // onEdgesChange already handles selection updates via applyEdgeChanges
  const onEdgesChange = useCallback(
    (changes) => {
        console.log("onEdgesChange received changes:", changes);
        setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdges],
  );

  // Modified onConnect to use custom edge IDs
  const onConnect = useCallback(
    (connection) => {
      const newEdge = {
        ...connection,
        id: getEdgeId(), // Generate custom edge ID
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges],
  );


  // Function to add a new parent node using the custom type
  const addParentNode = useCallback(() => {
    const newNodeId = getId('group'); // Use 'group' type for ID
    const newNode = {
      id: newNodeId,
      type: 'group',
      data: { label: 'New Stage' }, // Updated label
      position: { x: Math.random() * 200 + 50, y: Math.random() * 100 + 50 },
      style: {
        width: 500,
        height: 500,
        backgroundColor: 'rgba(0, 0, 255, 0.1)',
      },
      selected: true,
    };

    setNodes((nds) =>
      // Deselect all other nodes and add the new selected node
      nds.map(n => ({ ...n, selected: false })).concat(newNode)
    );
    // No need to manually set selectedNodeId here, useEffect will handle it
  }, [setNodes]);


  // Modified function to add a child node inside the selected parent OR as an orphan
  const addChildNode = useCallback(() => {
    const parentNode = nodes.find(node => node.id === selectedNodeId); // Use selectedNodeId state here
    const newNodeId = getId('task'); // Use 'task' type for ID
    let newNode;

    if (parentNode) {
      // Add as a child if a parent is selected
      // Calculate position relative to parent (e.g., slightly offset)
      // You might want more sophisticated logic to place it without overlap
      const childX = 10 + Math.random() * 40;
      const childY = 30 + Math.random() * 50;

      newNode = {
        id: newNodeId,
        data: { label: `New Task` }, // Updated label
        position: { x: childX, y: childY },
        parentId: parentNode.id,
        extent: 'parent', // Keep it within the parent bounds
      };
    } else {
      // Add as a regular node (still using 'task' prefix as requested)
      newNode = {
        id: newNodeId,
        data: { label: 'New Task' }, // Updated label
        position: { x: Math.random() * 200 + 50, y: Math.random() * 100 + 150 },
      };
      // Optionally, provide feedback that no parent was selected
      console.log("No parent selected, adding new task node to canvas."); // Log message updated
    }

    setNodes((nds) => nds.concat(newNode));
  }, [selectedNodeId, nodes, setNodes]);


  // Function to handle resizing the selected parent node
  const handleParentResize = useCallback(() => {
    if (!selectedNodeId || !selectedNodeIsGroup) return; // Only resize selected group nodes

    const newWidth = parseInt(widthInput, 10);
    const newHeight = parseInt(heightInput, 10);

    if (isNaN(newWidth) || isNaN(newHeight) || newWidth <= 0 || newHeight <= 0) {
      console.error("Invalid width or height value");
      // Optionally reset inputs to current node dimensions or show an error message
      return;
    }

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNodeId) {
          return {
            ...node,
            style: {
              ...node.style,
              width: newWidth,
              height: newHeight,
            },
          };
        }
        return node;
      })
    );
  }, [selectedNodeId, selectedNodeIsGroup, widthInput, heightInput, setNodes]); // Corrected typo and added missing dependency

  // Function to handle renaming the selected node
  const handleRenameNode = useCallback(() => {
    console.log(`Attempting to rename node ${selectedNodeId} to "${renameInput}"`);
    if (!selectedNodeId) {
        console.log("Rename failed: No node selected.");
        return;
    }

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNodeId) {
          console.log("Found node to rename:", node);
          // Create a new data object with the updated label
          const updatedNode = {
            ...node,
            data: { ...node.data, label: renameInput },
          };
          console.log("Updated node data:", updatedNode);
          return updatedNode;
        }
        return node;
      })
    );
  }, [selectedNodeId, renameInput, setNodes]); // Add dependencies


  // Function to handle deleting the selected node
  const handleDeleteNode = useCallback(() => {
    if (!selectedNodeId) {
      console.log("Delete failed: No node selected.");
      return;
    }

    console.log(`Attempting to delete node ${selectedNodeId}`);

    // Remove the selected node
    setNodes((nds) => nds.filter((node) => node.id !== selectedNodeId));

    // Remove edges connected to the selected node
    setEdges((eds) =>
      eds.filter(
        (edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId
      )
    );

    // Clear selection state manually since the node is gone
    // useEffect will handle clearing inputs based on state change
    setSelectedNodeId(null);

  }, [selectedNodeId, setNodes, setEdges]);

  // Function to handle deleting the selected edge (from direct selection)
  const handleDeleteEdge = useCallback(() => {
    if (!selectedEdgeId) return;
    setEdges((eds) => eds.filter((edge) => edge.id !== selectedEdgeId));
    setSelectedEdgeId(null);
  }, [selectedEdgeId, setEdges]);

  // Function to delete a specific edge by ID (called from node's connection list)
  const handleDeleteSpecificEdge = useCallback((edgeIdToDelete) => {
    console.log(`Attempting to delete specific edge ${edgeIdToDelete}`);
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeIdToDelete));
    // If the currently selected edge is the one being deleted, clear selection
    if (selectedEdgeId === edgeIdToDelete) {
        setSelectedEdgeId(null);
    }
  }, [selectedEdgeId, setEdges]); // Added selectedEdgeId dependency


  // Function to handle saving the workflow with specific data structure
  const handleSave = useCallback(() => {
    const parentNodesData = [];
    const childNodesData = [];

    // Process nodes
    nodes.forEach(node => {
      // Only nodes with type 'group' are considered parents in the saved structure
      if (node.type === 'group') {
        parentNodesData.push({
          id: node.id,
          label: node.data?.label || '',
        });
      } else { // All other node types are considered children
        // Find edges connected to this child node
        const connectedEdges = edges.filter(edge => edge.source === node.id || edge.target === node.id);

        // Initialize sources and targets arrays
        const sources = [];
        const targets = [];

        // Populate sources and targets based on connected edges
        connectedEdges.forEach(edge => {
          if (edge.target === node.id) {
            sources.push(edge.source);
          }
          if (edge.source === node.id) {
            targets.push(edge.target);
          }
        });

        childNodesData.push({
          id: node.id,
          label: node.data?.label || '',
          // Set parentNode to the actual parentId, or null if it doesn't have one
          parentNode: node.parentId || null,
          connections: {
             sources: sources,
             targets: targets,
          },
        });
      }
    });

    // Prepare the final structured data
    const structuredData = {
      parentNodes: parentNodesData,
      childNodes: childNodesData,
    };

    console.log("Saving Structured Workflow Data:");
    console.log(JSON.stringify(structuredData, null, 2)); // Pretty print JSON
    alert("Structured workflow data logged to console. Check the developer tools.");

  }, [nodes, edges]); // Depend on nodes and edges


  // Memoize the sorted nodes array for rendering order
  const sortedNodes = useMemo(() => {
    return [...nodes].sort((a, b) => {
      // Render group nodes first
      if (a.type === 'group' && b.type !== 'group') {
        return -1; // a comes first
      }
      if (a.type !== 'group' && b.type === 'group') {
        return 1; // b comes first
      }
      // Otherwise, maintain relative order (or sort by id/other property if needed)
      return 0;
    });
  }, [nodes]); // Re-sort only when nodes array changes


  // Find connections for the selected node (if it's not a group)
  const selectedNodeConnections = useMemo(() => {
    if (!selectedNodeId || selectedNodeIsGroup) {
      return [];
    }
    return edges.filter(edge => edge.source === selectedNodeId || edge.target === selectedNodeId);
  }, [selectedNodeId, selectedNodeIsGroup, edges]);


  return (
    <div style={containerStyles} ref={reactFlowWrapper}>
      <div style={toolbarStyles}>
        {/* Node Creation Buttons */}
        <button onClick={addParentNode} style={buttonStyles}>Add Parent Node</button>
        <button onClick={addChildNode} style={buttonStyles}>
           {selectedNodeId ? 'Add Child to Selected' : 'Add Node'}
        </button>

        {/* Edit Controls Container - Visible when any node is selected */}
        {selectedNodeId && (
          <div style={{ borderLeft: '2px solid #ccc', paddingLeft: '10px', marginLeft: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}> {/* Changed layout to column */}
            {/* Top Row: Rename, Resize, Delete Node */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {/* Rename Controls */}
              <div>
                <span>Rename Node ({selectedNodeId}):</span>
                <input
                  type="text"
                  value={renameInput}
                  onChange={(e) => setRenameInput(e.target.value)}
                  style={renameInputStyles}
                />
                <button onClick={handleRenameNode} style={{ marginLeft: '5px' }}>Apply Name</button>
              </div>

              {/* Resize Controls - Visible only when a group node is selected */}
              {selectedNodeIsGroup && (
                <div>
                  <span>Resize Parent:</span>
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
                  <button onClick={handleParentResize} style={{ marginLeft: '5px' }}>Apply Size</button>
                </div>
              )}

              {/* Delete Node Button */}
              <button onClick={handleDeleteNode} style={deleteButtonStyle}>
                Delete Node
              </button>
            </div>

            {/* Connections List - Visible only when a non-group node is selected */}
            {!selectedNodeIsGroup && selectedNodeConnections.length > 0 && (
              <div style={connectionListStyle}>
                <strong>Connections:</strong>
                {selectedNodeConnections.map(edge => (
                  <div key={edge.id} style={connectionItemStyle}>
                    <span style={connectionTextStyle}>
                      {edge.source === selectedNodeId ? `➡️ To: ${edge.target}` : `⬅️ From: ${edge.source}`}
                    </span>
                    <button
                      onClick={() => handleDeleteSpecificEdge(edge.id)}
                      style={{ ...deleteButtonStyle, marginLeft: 'auto', padding: '2px 5px', fontSize: '10px' }} // Smaller delete button
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
          </div>
        )}

        {/* Delete Edge Control - Visible when an edge is directly selected */}
        {selectedEdgeId && (
           <div style={{ borderLeft: '2px solid #ccc', paddingLeft: '10px', marginLeft: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
             <span>Selected Connection: {selectedEdgeId}</span>
             <button onClick={handleDeleteEdge} style={deleteButtonStyle}>
                Delete Connection
             </button>
           </div>
        )}


        {/* Status Text */}
        {!selectedNodeId && !selectedEdgeId && <span style={{ marginLeft: 'auto', fontStyle: 'italic' }}>Select an element to edit</span>}

      </div>
      <div style={flowStyles}>
        <ReactFlow
          nodes={sortedNodes} // Use the sorted nodes array
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          style={rfStyle}
          attributionPosition="bottom-right"
          selectNodesOnDrag={true}
          edgesFocusable={true}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>

      {/* Save Button Container */}
      <div style={saveButtonContainerStyles}>
        <button onClick={handleSave} style={saveButtonStyle}>
          Save Workflow
        </button>
      </div>
    </div>
  );
}

export default DesignWorkflows;
