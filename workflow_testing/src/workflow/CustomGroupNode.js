import React, { memo } from 'react';

// Basic styling for the custom group node
const groupNodeStyle = {
  // Use node dimensions from style prop
  // backgroundColor is handled by the node's style prop
  border: '1px solid #ccc', // Default border, can be overridden by node style
  borderRadius: '4px',
  width: '100%',
  height: '100%',
  padding: '25px 10px 10px 10px',
  boxSizing: 'border-box',
  position: 'relative', // Needed for absolute positioning of label
};

const labelStyle = {
  position: 'absolute',
  top: '5px',
  left: '10px',
  right: '10px',
  textAlign: 'center',
  color: '#555',
  fontSize: '12px',
  fontWeight: 'bold',
  // Prevent label from interfering with node selection/drag
  pointerEvents: 'none',
  userSelect: 'none',
};

const CustomGroupNode = ({ data, style }) => {
  // Combine default styles with node-specific styles
  const combinedStyle = {
    ...groupNodeStyle,
    ...style, // Apply width, height, backgroundColor etc. from node.style
  };

  return (
    <div style={combinedStyle}>
      <div style={labelStyle}>{data?.label || 'Group'}</div>
      {/* React Flow automatically renders child nodes and edges inside this container */}
    </div>
  );
};

export default memo(CustomGroupNode);
