import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls, // Re-import Controls if it was removed
  useReactFlow,
  ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import CustomGroupNode from './CustomGroupNode';
import HeaderBar from './HeaderBar';
import ControlPanel from './ControlPanel';

// Updated container style for column layout (Header + Main Content)
const containerStyles = { height: '100vh', width: '100%', display: 'flex', flexDirection: 'column' };
// Style for the main content area (Flow + Sidebar)
const mainContentStyles = { display: 'flex', flexDirection: 'row', flexGrow: 1, height: 'calc(100% - 41px)' }; // Adjust height based on header height
const flowContainerStyles = { flexGrow: 1, height: '100%' };
const rfStyle = {
  backgroundColor: '#f0f0f0',
};

// --- ID Generation (moved outside component) ---
let stageIdCounter = 0;
let taskIdCounter = 0;
let edgeIdCounter = 0;

const getId = (type) => {
  switch (type) {
    case 'group':
      return `Stage_${stageIdCounter++}`;
    case 'task':
    default:
      return `Task_${taskIdCounter++}`;
  }
};

const getEdgeId = () => `Connection_${edgeIdCounter++}`;

// --- Node Types Definition (moved outside component) ---
const nodeTypes = {
  group: CustomGroupNode,
};


// Define CSS styles as a string
const selectedNodeStyles = `
  .react-flow__node.selected {
    border: 2px solid #007bff !important; /* Use !important to ensure override */
    box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
  }

  /* Optional: Style for selected group nodes specifically */
  /*
  .react-flow__node.selected.react-flow__node-group {
     border-color: #ffc107 !important;
  }
  */
`;


function DesignWorkflows() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const reactFlowWrapper = useRef(null);
  // REMOVED: useReactFlow hook usage here if only used for controls

  // Effect to update selected IDs based on nodes/edges state
  useEffect(() => {
    const currentlySelectedNode = nodes.find(node => node.selected);
    const currentlySelectedEdge = edges.find(edge => edge.selected);

    if (currentlySelectedNode) {
      setSelectedNodeId(currentlySelectedNode.id);
      setSelectedEdgeId(null);
    } else if (currentlySelectedEdge) {
      setSelectedEdgeId(currentlySelectedEdge.id);
      setSelectedNodeId(null);
    } else {
      setSelectedNodeId(null);
      setSelectedEdgeId(null);
    }
  }, [nodes, edges]);

  // --- Core State Update Callbacks ---
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );
  const onConnect = useCallback(
    (connection) => {
      const newEdge = { ...connection, id: getEdgeId() };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges],
  );

  // --- Node/Edge Creation Callbacks ---
  const addParentNode = useCallback(() => {
    // ... (keep existing logic using getId('group')) ...
    const newNodeId = getId('group');
    const newNode = { /* ... node data ... */ id: newNodeId, type: 'group', data: { label: 'New Stage' }, position: { x: Math.random() * 200 + 50, y: Math.random() * 100 + 50 }, style: { width: 500, height: 500, backgroundColor: 'rgba(0, 0, 255, 0.1)' }, selected: true };
    setNodes((nds) => nds.map(n => ({ ...n, selected: false })).concat(newNode));
  }, [setNodes]);

  const addChildNode = useCallback(() => {
    // ... (keep existing logic using getId('task')) ...
    const parentNode = nodes.find(node => node.id === selectedNodeId);
    const newNodeId = getId('task');
    let newNode;
    if (parentNode) {
        const childX = 10 + Math.random() * 40;
        const childY = 30 + Math.random() * 50;
        newNode = { id: newNodeId, data: { label: `New Task` }, position: { x: childX, y: childY }, parentId: parentNode.id, extent: 'parent' };
    } else {
        newNode = { id: newNodeId, data: { label: 'New Task' }, position: { x: Math.random() * 200 + 50, y: Math.random() * 100 + 150 } };
    }
    setNodes((nds) => nds.concat(newNode));
  }, [selectedNodeId, nodes, setNodes]);


  // --- Node/Edge Modification/Deletion Callbacks (passed to ControlPanel) ---
  const handleRenameNode = useCallback((nodeId, newLabel) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, label: newLabel } };
        }
        return node;
      })
    );
  }, [setNodes]);

  const handleParentResize = useCallback((nodeId, newWidthStr, newHeightStr) => {
    const newWidth = parseInt(newWidthStr, 10);
    const newHeight = parseInt(newHeightStr, 10);
    if (isNaN(newWidth) || isNaN(newHeight) || newWidth <= 0 || newHeight <= 0) return;

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId && node.type === 'group') { // Ensure it's the correct node and type
          return { ...node, style: { ...node.style, width: newWidth, height: newHeight } };
        }
        return node;
      })
    );
  }, [setNodes]);

  const handleDeleteNode = useCallback((nodeIdToDelete) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeIdToDelete));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeIdToDelete && edge.target !== nodeIdToDelete));
    // Selection cleared by useEffect
  }, [setNodes, setEdges]);

  const handleDeleteEdge = useCallback((edgeIdToDelete) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeIdToDelete));
    // Selection cleared by useEffect
  }, [setEdges]);

  // handleDeleteSpecificEdge remains the same as it already accepts an ID
  const handleDeleteSpecificEdge = useCallback((edgeIdToDelete) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeIdToDelete));
    if (selectedEdgeId === edgeIdToDelete) {
        setSelectedEdgeId(null); // Manually clear if it was the selected one
    }
  }, [selectedEdgeId, setEdges]);


  // --- Save Callback ---
  const handleSave = useCallback(() => {
    // ... (keep existing save logic) ...
    const parentNodesData = [];
    const childNodesData = [];
    nodes.forEach(node => {
      if (node.type === 'group') {
        parentNodesData.push({ id: node.id, label: node.data?.label || '' });
      } else {
        const connectedEdges = edges.filter(edge => edge.source === node.id || edge.target === node.id);
        const sources = connectedEdges.filter(e => e.target === node.id).map(e => e.source);
        const targets = connectedEdges.filter(e => e.source === node.id).map(e => e.target);
        childNodesData.push({ id: node.id, label: node.data?.label || '', parentNode: node.parentId || null, connections: { sources, targets } });
      }
    });
    const structuredData = { parentNodes: parentNodesData, childNodes: childNodesData };
    console.log("Saving Structured Workflow Data:", JSON.stringify(structuredData, null, 2));
    alert("Structured workflow data logged to console.");
  }, [nodes, edges]);


  // --- Memos for Derived Data (passed to ControlPanel) ---
  const sortedNodes = useMemo(() => {
    // ... (keep existing sorting logic) ...
    return [...nodes].sort((a, b) => {
      if (a.type === 'group' && b.type !== 'group') return -1;
      if (a.type !== 'group' && b.type === 'group') return 1;
      return 0;
    });
  }, [nodes]);

  const selectedNode = useMemo(() => nodes.find(n => n.id === selectedNodeId), [nodes, selectedNodeId]);

  const selectedNodeConnections = useMemo(() => {
    if (!selectedNodeId || selectedNode?.type === 'group') { // Check selectedNode object type
      return [];
    }
    return edges.filter(edge => edge.source === selectedNodeId || edge.target === selectedNodeId);
  }, [selectedNodeId, selectedNode, edges]); // Depend on selectedNode object


  return (
    <>
      <style>{selectedNodeStyles}</style>
      <div style={containerStyles}>
        {/* Render Header Bar */}
        <HeaderBar
          onAddParentNode={addParentNode}
          onAddChildNode={addChildNode}
          selectedNodeId={selectedNodeId}
          onSaveWorkflow={handleSave} // Pass save handler
        />

        {/* Main Content Area (Flow + Sidebar) */}
        <div style={mainContentStyles}>
            <div style={flowContainerStyles} ref={reactFlowWrapper}>
              <ReactFlow
                nodes={sortedNodes}
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

            {/* Render Control Panel Sidebar */}
            <ControlPanel
              selectedNode={selectedNode}
              selectedEdgeId={selectedEdgeId}
              selectedNodeConnections={selectedNodeConnections}
              onRenameNode={handleRenameNode}
              onResizeNode={handleParentResize}
              onDeleteNode={handleDeleteNode}
              onDeleteEdge={handleDeleteEdge}
              onDeleteSpecificEdge={handleDeleteSpecificEdge}
            />
        </div>
      </div>
    </>
  );
}

// Wrap DesignWorkflows with ReactFlowProvider
// This is often done in App.js or index.js, but can be done here too.
// For simplicity, assuming it's provided higher up or adding it here:
function DesignWorkflowsWrapper() {
  return (
    <ReactFlowProvider>
      <DesignWorkflows />
    </ReactFlowProvider>
  );
}

export default DesignWorkflowsWrapper; // Export the wrapped component
