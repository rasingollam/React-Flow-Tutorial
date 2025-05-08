import React, { useState, useEffect } from 'react';

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
  display: 'block',
  marginBottom: '4px',
};

const valueStyle = {
  color: '#555',
  wordBreak: 'break-all',
};

const inputStyle = {
  width: 'calc(100% - 10px)',
  padding: '8px',
  marginBottom: '10px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  boxSizing: 'border-box',
};

const buttonStyle = {
  padding: '8px 15px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginTop: '10px',
};

const CustomBpmnPropertiesPanel = ({ selectedElement, onUpdateCustomProperties }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  useEffect(() => {
    if (selectedElement && selectedElement.businessObject) {
      const bo = selectedElement.businessObject;
      setStartDate(bo.get('startDate') || '');
      setEndDate(bo.get('endDate') || '');
      setStatus(bo.get('status') || '');
      setAssignedTo(bo.get('assignedTo') || '');
    } else {
      setStartDate('');
      setEndDate('');
      setStatus('');
      setAssignedTo('');
    }
  }, [selectedElement]);

  const handleApplyCustomProperties = () => {
    if (selectedElement && onUpdateCustomProperties) {
      const propertiesToUpdate = {
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        status: status || undefined,
        assignedTo: assignedTo || undefined,
      };
      onUpdateCustomProperties(selectedElement, propertiesToUpdate);
    }
  };

  if (!selectedElement || !selectedElement.businessObject) {
    return (
      <div style={panelStyle}>
        <p>No element selected or element has no business object.</p>
      </div>
    );
  }

  const { businessObject } = selectedElement;
  const isTask = businessObject.$type === 'bpmn:Task' || businessObject.$type === 'bpmn:UserTask';

  const excludeProperties = ['$type', 'extensionElements', 'di', '$parent', 'flowElements', 'artifacts', 'lanes', 'participants'];

  return (
    <div style={panelStyle}>
      <h3>Properties for: {businessObject.id || businessObject.name || businessObject.$type}</h3>

      {isTask && (
        <div style={{ marginTop: '20px', paddingTop: '10px', borderTop: '1px solid #ddd' }}>
          <h4>Custom Task Attributes</h4>
          <div>
            <label htmlFor="startDate" style={labelStyle}>Start Date:</label>
            <input
              id="startDate"
              type="date"
              style={inputStyle}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="endDate" style={labelStyle}>End Date:</label>
            <input
              id="endDate"
              type="date"
              style={inputStyle}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="status" style={labelStyle}>Status:</label>
            <input
              id="status"
              type="text"
              style={inputStyle}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="e.g., Pending, In Progress"
            />
          </div>
          <div>
            <label htmlFor="assignedTo" style={labelStyle}>Assigned To:</label>
            <input
              id="assignedTo"
              type="text"
              style={inputStyle}
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="e.g., John Doe"
            />
          </div>
          <button style={buttonStyle} onClick={handleApplyCustomProperties}>
            Apply Custom Attributes
          </button>
        </div>
      )}

      <h4 style={{ marginTop: '20px' }}>Standard Attributes:</h4>
      {Object.entries(businessObject)
        .filter(([key]) => !excludeProperties.includes(key) && !key.startsWith('$'))
        .map(([key, value]) => {
          let displayValue = value;
          if (typeof value === 'object' && value !== null) {
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
        {JSON.stringify(businessObject, (key, value) => {
          if (key === '$parent') return '[Parent Object]';
          return value;
        }, 2)}
      </pre>
    </div>
  );
};

export default CustomBpmnPropertiesPanel;
