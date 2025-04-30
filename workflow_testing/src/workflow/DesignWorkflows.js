import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { initialNodes } from './nodes';
import { initialEdges } from './edges';
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


// Counter for unique node IDs - Start from 0 for empty canvas
let idCounter = 0;
const getId = () => `dndnode_${idCounter++}`;

// Define the custom node types
const nodeTypes = {
  group: CustomGroupNode,
};

function DesignWorkflows() {
  // Initialize with empty arrays from imported files
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedNodeIsGroup, setSelectedNodeIsGroup] = useState(false);
  const [widthInput, setWidthInput] = useState('');
  const [heightInput, setHeightInput] = useState('');
  const [renameInput, setRenameInput] = useState('');
  const reactFlowWrapper = useRef(null);


  // Effect to update UI state based on the currently selected node in the nodes array
  useEffect(() => {
    // Find the node that has selected = true
    const currentlySelectedNode = nodes.find(node => node.selected);
    console.log("Effect running. Found selected node:", currentlySelectedNode?.id);

    if (currentlySelectedNode) {
      // Update the selectedNodeId state
      setSelectedNodeId(currentlySelectedNode.id);
      console.log("Selected Node Object:", currentlySelectedNode);

      // Update rename input
      const currentLabel = currentlySelectedNode.data?.label || '';
      console.log("Setting rename input to:", currentLabel);
      setRenameInput(currentLabel);

      // Check if it's our custom group type (or potentially default 'group' if needed)
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
      console.log("No node selected in nodes array, clearing inputs.");
      // Clear all inputs and selected ID if no node is selected
      setSelectedNodeId(null); // Clear selected ID state
      setSelectedNodeIsGroup(false);
      setWidthInput('');
      setHeightInput('');
      setRenameInput('');
    }
  // Depend directly on the nodes array. When it changes (e.g., selection updates), this effect runs.
  }, [nodes]);


  // Simplified onNodesChange - let applyNodeChanges handle selection flags
  const onNodesChange = useCallback(
    (changes) => {
      console.log("onNodesChange received changes:", changes);
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes] // No longer depends on nodes or selectedNodeId here
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );


  // Function to add a new parent node using the custom type
  const addParentNode = useCallback(() => {
    const newNodeId = getId();
    const newNode = {
      id: newNodeId,
      type: 'group', // This now refers to our CustomGroupNode via nodeTypes
      data: { label: 'New Parent' },
      position: { x: Math.random() * 200 + 50, y: Math.random() * 100 + 50 },
      style: {
        width: 500,
        height: 500,
        backgroundColor: 'rgba(0, 0, 255, 0.1)',
        // Border is now handled by CustomGroupNode, but can be overridden here
        // border: '1px solid blue',
      },
      selected: true, // Mark the new node as selected
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
    const newNodeId = getId();
    let newNode;

    if (parentNode) {
      // Add as a child if a parent is selected
      // Calculate position relative to parent (e.g., slightly offset)
      // You might want more sophisticated logic to place it without overlap
      const childX = 10 + Math.random() * 40;
      const childY = 30 + Math.random() * 50;

      newNode = {
        id: newNodeId,
        data: { label: `Child of ${parentNode.id}` },
        position: { x: childX, y: childY },
        parentId: parentNode.id,
        extent: 'parent', // Keep it within the parent bounds
      };
    } else {
      // Add as a regular node if no parent is selected
      newNode = {
        id: newNodeId,
        data: { label: 'New Node' }, // Changed label slightly
        position: { x: Math.random() * 200 + 50, y: Math.random() * 100 + 150 },
      };
      // Optionally, provide feedback that no parent was selected
      console.log("No parent selected, adding new node to canvas."); // Log message updated
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
    setSelectedNodeId(null);
    // No need to clear other inputs here, useEffect will handle it when selectedNodeId becomes null

  }, [selectedNodeId, setNodes, setEdges]); // Add dependencies


  // Function to handle saving the workflow with specific data structure
  const handleSave = useCallback(() => {
    const parentNodesData = [];
    const childNodesData = [];

    // Process nodes
    nodes.forEach(node => {
      if (node.type === 'group' || !node.parentId) { // Identify parent/group nodes
        parentNodesData.push({
          id: node.id,
          label: node.data?.label || '',
        });
      } else if (node.parentId) { // Identify child nodes
        // Find edges connected to this child node
        const connectedEdges = edges.filter(edge => edge.source === node.id || edge.target === node.id);

        // Initialize sources and targets arrays
        const sources = [];
        const targets = [];

        // Populate sources and targets based on connected edges
        connectedEdges.forEach(edge => {
          if (edge.target === node.id) {
            // If this node is the target, the edge source is an incoming connection
            sources.push(edge.source);
          }
          if (edge.source === node.id) {
            // If this node is the source, the edge target is an outgoing connection
            targets.push(edge.target);
          }
        });

        childNodesData.push({
          id: node.id,
          label: node.data?.label || '',
          parentNode: node.parentId,
          // Assign the new connections structure
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
          <div style={{ borderLeft: '2px solid #ccc', paddingLeft: '10px', marginLeft: '10px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
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

            {/* Delete Button */}
            <button onClick={handleDeleteNode} style={deleteButtonStyle}>
              Delete Node
            </button>
          </div>
        )}

        {/* Status Text */}
        {!selectedNodeId && <span style={{ marginLeft: 'auto', fontStyle: 'italic' }}>Select a node to edit</span>}

      </div>
      <div style={flowStyles}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          style={rfStyle}
          attributionPosition="bottom-right"
          selectNodesOnDrag={true}
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
