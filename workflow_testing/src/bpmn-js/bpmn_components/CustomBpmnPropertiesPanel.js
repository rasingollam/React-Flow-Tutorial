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

// Helper to get a default value based on type, useful for initialization
const getDefaultValueForType = (type) => {
  switch (type) {
    case 'text': // Changed from 'string' to 'text' for consistency
    case 'url':  // Added url to default to empty string
    case 'date':
      return '';
    case 'number':
      return ''; // Default number to empty string for input, parse on change/save
    case 'boolean':
      return false;
    default:
      return '';
  }
};

const CustomBpmnPropertiesPanel = ({ selectedElement, attributeSchemas, onUpdateCustomProperties }) => {
  const [customFieldValues, setCustomFieldValues] = useState({});
  const [currentSchema, setCurrentSchema] = useState([]);

  useEffect(() => {
    if (selectedElement && selectedElement.businessObject && attributeSchemas) {
      const bo = selectedElement.businessObject;
      const elementType = bo.$type;
      const schemaForElement = attributeSchemas[elementType] || [];
      setCurrentSchema(schemaForElement);

      const initialValues = {};
      schemaForElement.forEach(attrDef => {
        const existingValue = bo.get(attrDef.name);
        if (attrDef.type === 'boolean') {
          initialValues[attrDef.name] = existingValue !== undefined ? !!existingValue : getDefaultValueForType(attrDef.type);
        } else {
          initialValues[attrDef.name] = existingValue !== undefined ? existingValue : getDefaultValueForType(attrDef.type);
        }
      });
      setCustomFieldValues(initialValues);

    } else {
      setCurrentSchema([]);
      setCustomFieldValues({});
    }
  }, [selectedElement, attributeSchemas]);

  const handleCustomFieldChange = (fieldName, value, type) => {
    setCustomFieldValues(prevValues => ({
      ...prevValues,
      // For boolean, the value is already e.target.checked (true/false)
      // For number, store as string from input, parse on apply
      [fieldName]: value,
    }));
  };

  const handleApplyCustomProperties = () => {
    if (selectedElement && onUpdateCustomProperties && currentSchema.length > 0) {
      const propertiesToUpdate = {};
      currentSchema.forEach(attrDef => {
        let value = customFieldValues[attrDef.name];

        if (attrDef.type === 'number') {
          const numValue = parseFloat(value);
          value = isNaN(numValue) ? undefined : numValue;
        } else if (attrDef.type === 'boolean') {
          value = !!value; // Ensure it's a boolean
        } else if (value === '' && (attrDef.type === 'text' || attrDef.type === 'date' || attrDef.type === 'url')) {
          value = undefined; // Set to undefined to remove attribute if empty string
        }
        propertiesToUpdate[attrDef.name] = value;
      });
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

  const excludeProperties = ['$type', 'extensionElements', 'di', '$parent', 'flowElements', 'artifacts', 'lanes', 'participants'];

  return (
    <div style={panelStyle}>
      <h3>Properties for: {businessObject.id || businessObject.name || businessObject.$type}</h3>

      {/* Dynamically Rendered Custom Fields Section */}
      {/* The conditional rendering is now based on currentSchema.length > 0 */}
      {currentSchema.length > 0 && (
        <div style={{ marginTop: '20px', paddingTop: '10px', borderTop: '1px solid #ddd' }}>
          {/* Dynamic heading based on the element type */}
          <h4>Custom Attributes for {businessObject.$type}</h4>
          {currentSchema.map((attrDef) => (
            <div key={attrDef.name} style={{ marginBottom: '12px' }}>
              <label htmlFor={attrDef.name} style={labelStyle}>{attrDef.label}:</label>
              {attrDef.type === 'boolean' ? (
                <input
                  id={attrDef.name}
                  type="checkbox"
                  style={{ marginLeft: '5px', verticalAlign: 'middle' }}
                  checked={!!customFieldValues[attrDef.name]} // Ensure it's a boolean for checked prop
                  onChange={(e) => handleCustomFieldChange(attrDef.name, e.target.checked, 'boolean')}
                />
              ) : (
                <input
                  id={attrDef.name}
                  type={attrDef.type === 'url' ? 'text' : attrDef.type} // HTML input types (date, number, text)
                  style={inputStyle}
                  value={customFieldValues[attrDef.name] === undefined ? '' : String(customFieldValues[attrDef.name])}
                  onChange={(e) => handleCustomFieldChange(attrDef.name, e.target.value, attrDef.type)}
                  placeholder={attrDef.placeholder || ''}
                  // For number inputs, min/max/step are fine if type="number"
                  min={attrDef.type === 'number' ? attrDef.min : undefined}
                  max={attrDef.type === 'number' ? attrDef.max : undefined}
                  step={attrDef.type === 'number' ? attrDef.step : undefined}
                />
              )}
            </div>
          ))}
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
