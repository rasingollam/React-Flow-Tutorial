import React, { useState, useEffect } from 'react';

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalContentStyle = {
  background: 'white',
  padding: '25px',
  borderRadius: '8px',
  width: '600px',
  maxHeight: '80vh',
  overflowY: 'auto',
  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
};

const inputGroupStyle = {
  marginBottom: '15px',
  display: 'flex',
  flexDirection: 'column',
};

const labelStyle = {
  marginBottom: '5px',
  fontWeight: 'bold',
  fontSize: '14px',
};

const inputStyle = {
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '14px',
  marginBottom: '5px',
};

const selectStyle = {
  ...inputStyle,
  marginBottom: '15px',
};

const buttonStyle = {
  padding: '10px 18px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  marginRight: '10px',
};

const primaryButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#007bff',
  color: 'white',
};

const secondaryButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#6c757d',
  color: 'white',
};

const dangerButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#dc3545',
  color: 'white',
  marginLeft: 'auto',
  padding: '5px 10px',
  fontSize: '12px',
};

const attributeItemStyle = {
  padding: '10px',
  border: '1px solid #eee',
  borderRadius: '4px',
  marginBottom: '10px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const bpmnElementTypes = [
  // Common BPMN types - expand as needed
  'bpmn:Process',
  'bpmn:Task',
  'bpmn:UserTask',
  'bpmn:ServiceTask',
  'bpmn:ManualTask',
  'bpmn:ScriptTask',
  'bpmn:BusinessRuleTask',
  'bpmn:SendTask',
  'bpmn:ReceiveTask',
  'bpmn:StartEvent',
  'bpmn:EndEvent',
  'bpmn:IntermediateThrowEvent',
  'bpmn:IntermediateCatchEvent',
  'bpmn:BoundaryEvent',
  'bpmn:SequenceFlow',
  'bpmn:Gateway', // Generic Gateway
  'bpmn:ExclusiveGateway',
  'bpmn:ParallelGateway',
  'bpmn:InclusiveGateway',
  'bpmn:EventBasedGateway',
  'bpmn:ComplexGateway',
  'bpmn:Participant',
  'bpmn:Lane',
  'bpmn:DataObjectReference',
  'bpmn:DataStoreReference',
  'bpmn:SubProcess',
  'bpmn:CallActivity',
  // Add more types as you see fit
];

const attributeDataTypes = ['text', 'number', 'date', 'boolean', 'url'];

const SchemaDefinitionModal = ({ isOpen, onClose, currentSchemas, onSaveSchemas }) => {
  const [selectedElementType, setSelectedElementType] = useState(bpmnElementTypes[0]);
  const [attributesForType, setAttributesForType] = useState([]);
  const [newAttrName, setNewAttrName] = useState('');
  const [newAttrLabel, setNewAttrLabel] = useState('');
  const [newAttrType, setNewAttrType] = useState(attributeDataTypes[0]);
  const [newAttrPlaceholder, setNewAttrPlaceholder] = useState('');

  useEffect(() => {
    if (isOpen && selectedElementType) {
      setAttributesForType(currentSchemas[selectedElementType] || []);
    }
  }, [isOpen, selectedElementType, currentSchemas]);

  const handleAddAttribute = () => {
    if (!newAttrName.trim() || !newAttrLabel.trim()) {
      alert('Attribute Name and Label are required.');
      return;
    }
    const newAttribute = {
      name: newAttrName.trim(),
      label: newAttrLabel.trim(),
      type: newAttrType,
      placeholder: newAttrPlaceholder.trim() || undefined,
    };
    setAttributesForType([...attributesForType, newAttribute]);
    setNewAttrName('');
    setNewAttrLabel('');
    setNewAttrType(attributeDataTypes[0]);
    setNewAttrPlaceholder('');
  };

  const handleDeleteAttribute = (attrName) => {
    setAttributesForType(attributesForType.filter(attr => attr.name !== attrName));
  };

  const handleSave = () => {
    const updatedSchemas = {
      ...currentSchemas,
      [selectedElementType]: attributesForType,
    };
    onSaveSchemas(updatedSchemas);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <h2>Define Custom Attributes</h2>

        <div style={inputGroupStyle}>
          <label htmlFor="bpmnElementTypeSelect" style={labelStyle}>Select BPMN Element Type:</label>
          <select
            id="bpmnElementTypeSelect"
            style={selectStyle}
            value={selectedElementType}
            onChange={(e) => setSelectedElementType(e.target.value)}
          >
            {bpmnElementTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>

        <h4>Attributes for {selectedElementType}:</h4>
        {attributesForType.length === 0 && <p>No custom attributes defined for this type.</p>}
        {attributesForType.map(attr => (
          <div key={attr.name} style={attributeItemStyle}>
            <span><strong>{attr.label}</strong> ({attr.name}) - <em>{attr.type}</em></span>
            <button style={dangerButtonStyle} onClick={() => handleDeleteAttribute(attr.name)}>Delete</button>
          </div>
        ))}

        <hr style={{ margin: '20px 0' }} />
        <h4>Add New Attribute:</h4>
        <div style={inputGroupStyle}>
          <label htmlFor="newAttrName" style={labelStyle}>Attribute Name (unique, no spaces, e.g., 'taskPriority'):</label>
          <input id="newAttrName" type="text" style={inputStyle} value={newAttrName} onChange={(e) => setNewAttrName(e.target.value)} />
        </div>
        <div style={inputGroupStyle}>
          <label htmlFor="newAttrLabel" style={labelStyle}>Display Label (e.g., 'Task Priority'):</label>
          <input id="newAttrLabel" type="text" style={inputStyle} value={newAttrLabel} onChange={(e) => setNewAttrLabel(e.target.value)} />
        </div>
        <div style={inputGroupStyle}>
          <label htmlFor="newAttrType" style={labelStyle}>Data Type:</label>
          <select id="newAttrType" style={selectStyle} value={newAttrType} onChange={(e) => setNewAttrType(e.target.value)}>
            {attributeDataTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
         <div style={inputGroupStyle}>
          <label htmlFor="newAttrPlaceholder" style={labelStyle}>Placeholder (optional):</label>
          <input id="newAttrPlaceholder" type="text" style={inputStyle} value={newAttrPlaceholder} onChange={(e) => setNewAttrPlaceholder(e.target.value)} />
        </div>
        <button style={primaryButtonStyle} onClick={handleAddAttribute}>Add Attribute to List</button>

        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eee', textAlign: 'right' }}>
          <button style={secondaryButtonStyle} onClick={onClose}>Cancel</button>
          <button style={primaryButtonStyle} onClick={handleSave}>Save Definitions for {selectedElementType}</button>
        </div>
      </div>
    </div>
  );
};

export default SchemaDefinitionModal;
