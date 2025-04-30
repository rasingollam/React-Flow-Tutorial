import React, { memo } from 'react';

// Basic styling for the custom group node
const groupNodeStyle = {
  // Use node dimensions from style prop
  // backgroundColor is handled by the node's style prop
  border: '1px solid #ccc', // Default border, can be overridden by node style
  borderRadius: '4px',
  position: 'relative', // Needed for absolute positioning of label
  // Ensure children are positioned correctly
  width: '100%',
  height: '100%',
  // Add some padding inside if needed, so children don't overlap border
  // padding: '10px',
};

const labelStyle = {
  position: 'absolute',
  top: '-20px', // Position label above the node border
  left: '5px',
  color: '#555',
  fontSize: '12px',
  fontWeight: 'bold',
  // Prevent label from interfering with node selection/drag
  pointerEvents: 'none',
  userSelect: 'none',
  backgroundColor: 'rgba(240, 240, 240, 0.7)', // Optional: Add background for readability
  padding: '0 3px', // Optional: Add padding
  borderRadius: '2px', // Optional: Add border radius
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
      {/* React Flow automatically renders child nodes inside */}
    </div>
  );
};

export default memo(CustomGroupNode);
