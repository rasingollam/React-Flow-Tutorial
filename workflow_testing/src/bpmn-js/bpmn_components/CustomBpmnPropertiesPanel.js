import React from 'react';

const panelStyle = {
  width: '300px',
  padding: '15px',
  borderLeft: '1px solid #ccc',
  backgroundColor: '#f8f8f8',
  overflowY: 'auto',
  fontFamily: 'Arial, sans-serif',
  fontSize: '14px',
};

const entryStyle = {
  marginBottom: '8px',
  paddingBottom: '8px',
  borderBottom: '1px solid #eee',
};

const labelStyle = {
  fontWeight: 'bold',
  marginRight: '5px',
  color: '#333',
};

const valueStyle = {
  color: '#555',
  wordBreak: 'break-all',
};

const CustomBpmnPropertiesPanel = ({ selectedElement }) => {
  if (!selectedElement || !selectedElement.businessObject) {
    return (
      <div style={panelStyle}>
        <p>No element selected or element has no business object.</p>
      </div>
    );
  }

  const { businessObject } = selectedElement;

  // Properties to exclude from display (optional, can be expanded)
  const excludeProperties = ['$type', 'extensionElements', 'di', '$parent', 'flowElements', 'artifacts', 'lanes', 'participants'];

  return (
    <div style={panelStyle}>
      <h3>Properties for: {businessObject.id || businessObject.name || businessObject.$type}</h3>
      {Object.entries(businessObject)
        .filter(([key]) => !excludeProperties.includes(key) && !key.startsWith('$'))
        .map(([key, value]) => {
          let displayValue = value;
          if (typeof value === 'object' && value !== null) {
            // For complex objects, you might want to stringify or handle specific types
            if (value.$type) {
              displayValue = `[Object: ${value.$type}] (ID: ${value.id || 'N/A'})`;
            } else {
              displayValue = JSON.stringify(value);
            }
          } else if (value === undefined) {
            displayValue = 'undefined';
          } else if (value === null) {
            displayValue = 'null';
          }

          return (
            <div key={key} style={entryStyle}>
              <span style={labelStyle}>{key}:</span>
              <span style={valueStyle}>{String(displayValue)}</span>
            </div>
          );
      })}
      <h4>Raw Business Object:</h4>
      <pre style={{ fontSize: '12px', backgroundColor: '#eee', padding: '5px', overflowX: 'auto' }}>
        {JSON.stringify(businessObject, null, 2)}
      </pre>
    </div>
  );
};

export default CustomBpmnPropertiesPanel;
