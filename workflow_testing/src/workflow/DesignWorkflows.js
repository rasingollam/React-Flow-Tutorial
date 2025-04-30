import React, { useState, useCallback, useRef } from 'react';
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
const containerStyles = { height: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }; // Use flex column
const toolbarStyles = { padding: '10px', borderBottom: '1px solid #ccc', background: '#eee' };
const buttonStyles = { marginRight: '10px' };
const flowStyles = { flexGrow: 1 }; // Let the flow component grow
const rfStyle = {
  backgroundColor: '#f0f0f0',
};

// Counter for unique node IDs
let idCounter = initialNodes.length;
const getId = () => `dndnode_${idCounter++}`;


function DesignWorkflows() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState(null); // State to track selected node
  const reactFlowWrapper = useRef(null);

  const onNodesChange = useCallback(
    (changes) => {
      // Update selected node ID based on selection changes
      const selectionChange = changes.find(change => change.type === 'select');
      if (selectionChange) {
          // If multiple nodes are selected, we might only care about the last one selected,
          // or handle it differently. For simplicity, take the first selected node if available.
          const selectedNode = nodes.find(node => node.id === selectionChange.id && selectionChange.selected);
          setSelectedNodeId(selectedNode ? selectedNode.id : null);
          // If deselected, clear the ID
          if (!selectionChange.selected) {
              setSelectedNodeId(prevId => prevId === selectionChange.id ? null : prevId);
          }
      }
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes, nodes], // Add nodes dependency here
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  // Function to add a new parent node
  const addParentNode = useCallback(() => {
    const newNode = {
      id: getId(),
      type: 'group', // Or a custom type if you define one
      data: { label: 'New Parent' },
      position: { x: Math.random() * 200 + 50, y: Math.random() * 100 + 50 }, // Random position for demo
      style: {
        width: 170,
        height: 140,
        backgroundColor: 'rgba(0, 0, 255, 0.1)', // Different color for new parents
        border: '1px solid blue',
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, []);

  // Modified function to add a child node inside the selected parent
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
        position: { x: childX, y: childY }, // Position relative to parent
        parentId: parentNode.id,
        extent: 'parent', // Keep it within the parent bounds
      };
    } else {
      // Add as a regular node if no parent is selected
      newNode = {
        id: newNodeId,
        data: { label: 'New Node (Orphan)' },
        position: { x: Math.random() * 200 + 50, y: Math.random() * 100 + 150 },
      };
      // Optionally, provide feedback that no parent was selected
      console.log("No parent selected, adding node to canvas.");
    }

    setNodes((nds) => nds.concat(newNode));
  }, [selectedNodeId, nodes]); // Add dependencies


  return (
    <div style={containerStyles} ref={reactFlowWrapper}>
      <div style={toolbarStyles}>
        <button onClick={addParentNode} style={buttonStyles}>Add Parent Node</button>
        <button onClick={addChildNode} style={buttonStyles} disabled={!selectedNodeId}>
           Add Child to Selected
        </button>
        {/* Indicate selected node */}
        {selectedNodeId && <span style={{ marginLeft: '15px' }}>Selected: {selectedNodeId}</span>}
        {!selectedNodeId && <span style={{ marginLeft: '15px', fontStyle: 'italic' }}>Select a node to add child</span>}
      </div>
      <div style={flowStyles}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange} // This now handles selection tracking
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          style={rfStyle}
          attributionPosition="bottom-right"
          // Ensure nodes can be selected
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
