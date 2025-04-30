import React, { useState, useCallback, useRef, useEffect } from 'react'; // Added useEffect
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

// Basic styling for the container and toolbar
const containerStyles = { height: '100vh', width: '100%', display: 'flex', flexDirection: 'column' };
const toolbarStyles = { padding: '10px', borderBottom: '1px solid #ccc', background: '#eee', display: 'flex', alignItems: 'center', gap: '10px' }; // Use flex and gap
const buttonStyles = { marginRight: '10px' }; // Keep margin for buttons if needed
const inputStyles = { width: '60px', marginLeft: '5px' }; // Style for inputs
const flowStyles = { flexGrow: 1 };
const rfStyle = {
  backgroundColor: '#f0f0f0',
};

// Counter for unique node IDs - Start from 0 for empty canvas
let idCounter = 0;
const getId = () => `dndnode_${idCounter++}`;


function DesignWorkflows() {
  // Initialize with empty arrays from imported files
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedNodeIsGroup, setSelectedNodeIsGroup] = useState(false);
  const [widthInput, setWidthInput] = useState('');
  const [heightInput, setHeightInput] = useState('');
  const reactFlowWrapper = useRef(null);


  // Find the selected node object
  const selectedNode = nodes.find(node => node.id === selectedNodeId);

  // Effect to update input fields when selected node changes
  useEffect(() => {
    if (selectedNode && selectedNode.type === 'group') {
      setSelectedNodeIsGroup(true);
      setWidthInput(selectedNode.style?.width || '');
      setHeightInput(selectedNode.style?.height || '');
    } else {
      setSelectedNodeIsGroup(false);
      setWidthInput('');
      setHeightInput('');
    }
  }, [selectedNode]); // Depend on the selected node object

  const onNodesChange = useCallback(
    (changes) => {
      // Update selected node ID based on selection changes
      const selectionChange = changes.find(change => change.type === 'select');
      if (selectionChange) {
        // Find the node being selected/deselected
        const node = nodes.find(n => n.id === selectionChange.id);
        if (selectionChange.selected && node) {
          setSelectedNodeId(node.id); // Set selected ID
        } else if (!selectionChange.selected && selectedNodeId === selectionChange.id) {
          // If the currently selected node is deselected, clear the ID
          setSelectedNodeId(null);
        }
      }
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes, nodes, selectedNodeId], // Added selectedNodeId dependency
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );


  // Function to add a new parent node and select it
  const addParentNode = useCallback(() => {
    const newNodeId = getId();
    const newNode = {
      id: newNodeId,
      type: 'group',
      data: { label: 'New Parent' },
      position: { x: Math.random() * 200 + 50, y: Math.random() * 100 + 50 },
      style: {
        width: 200,
        height: 140,
        backgroundColor: 'rgba(0, 0, 255, 0.1)',
        border: '1px solid blue',
      },
      selected: true, // Mark the new node as selected
    };

    setNodes((nds) =>
      // Deselect all other nodes and add the new selected node
      nds.map(n => ({ ...n, selected: false })).concat(newNode)
    );
    // Manually update the selectedNodeId state
    setSelectedNodeId(newNodeId);
  }, [setNodes, setSelectedNodeId]); // Add setSelectedNodeId dependency


  // Modified function to add a child node inside the selected parent OR as an orphan
  const addChildNode = useCallback(() => {
    const parentNode = nodes.find(node => node.id === selectedNodeId);
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
  }, [selectedNodeId, nodes]); // Dependencies remain the same


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


  return (
    <div style={containerStyles} ref={reactFlowWrapper}>
      <div style={toolbarStyles}>
        <button onClick={addParentNode} style={buttonStyles}>Add Parent Node</button>
        {/* Updated button: Always enabled, text reflects dual purpose */}
        <button onClick={addChildNode} style={buttonStyles}>
           {selectedNodeId ? 'Add Child to Selected' : 'Add Node'}
        </button>

        {/* Resize controls - visible only when a group node is selected */}
        {selectedNodeIsGroup && (
          <>
            <span style={{ marginLeft: '15px' }}>Resize Parent ({selectedNodeId}):</span>
            <label> W:
              <input
                type="number"
                value={widthInput}
                onChange={(e) => setWidthInput(e.target.value)}
                style={inputStyles}
                min="10" // Example minimum
              />
            </label>
            <label> H:
              <input
                type="number"
                value={heightInput}
                onChange={(e) => setHeightInput(e.target.value)}
                style={inputStyles}
                min="10" // Example minimum
              />
            </label>
            <button onClick={handleParentResize}>Apply Size</button>
          </>
        )}
        {/* Updated status text */}
        {!selectedNodeId && <span style={{ marginLeft: '15px', fontStyle: 'italic' }}>Select a node to add child inside it</span>}
        {selectedNodeId && !selectedNodeIsGroup && <span style={{ marginLeft: '15px' }}>Selected: {selectedNodeId} (Not a Parent Group)</span>}

      </div>
      <div style={flowStyles}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          style={rfStyle}
          attributionPosition="bottom-right"
          selectNodesOnDrag={true}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

export default DesignWorkflows;
