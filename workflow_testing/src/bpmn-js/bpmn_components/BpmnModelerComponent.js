import React, { useEffect, useRef, useState } from 'react';
import BpmnJS from 'bpmn-js/lib/Modeler';

// Import our new custom properties panel
import CustomBpmnPropertiesPanel from './CustomBpmnPropertiesPanel'; // Import the new panel
import SchemaDefinitionModal from './SchemaDefinitionModal'; // Import the modal

// Import BPMN-JS CSS files
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
// NOTE: The import for 'bpmn-js-properties-panel.css' is no longer needed and was previously commented out.
// We are also no longer importing BpmnPropertiesPanelModule, BpmnPropertiesProviderModule, or CustomPropertiesProvider.

// A default empty diagram
const emptyBpmnDiagram = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" targetNamespace="http://bpmn.io/schema/bpmn" id="Definitions_1">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1"/>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds height="36.0" width="36.0" x="173.0" y="102.0"/>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

const containerStyle = { // Style for the overall container including properties panel
  display: 'flex',
  height: 'calc(100vh - 100px)', // Adjust as needed
  width: '100%',
};

const modelerContainerStyle = { // Style for the diagram canvas
  flexGrow: 1, // Canvas takes available space
  height: '100%',
  backgroundColor: '#fff',
  position: 'relative', // Needed for positioning the button
};

const defineAttrsButtonStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px', // Adjust as needed, ensure it doesn't overlap save button if that's also absolute
  zIndex: 20, // Ensure it's above the canvas
  padding: '8px 15px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const BpmnModelerComponent = () => {
  const modelerRef = useRef(null);
  const bpmnModelerInstance = useRef(null);
  const [error, setError] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false); // State for modal
  const fileInputRef = useRef(null); // Ref for the hidden file input

  // Define schemas for custom attributes - initially empty, user defines via modal
  const [attributeSchemas, setAttributeSchemas] = useState({});

  useEffect(() => {
    if (!modelerRef.current) {
      return;
    }

    // Initialize BpmnJS modeler
    bpmnModelerInstance.current = new BpmnJS({
      container: modelerRef.current,
      keyboard: {
        bindTo: window
      }
    });

    // Listen for selection changes
    const eventBus = bpmnModelerInstance.current.get('eventBus');
    eventBus.on('selection.changed', (context) => {
      const { newSelection } = context;
      if (newSelection && newSelection.length > 0) {
        setSelectedElement(newSelection[0]); // Assuming single selection
        console.log('Selected element:', newSelection[0]);
      } else {
        setSelectedElement(null);
        console.log('Selection cleared');
      }
    });
    eventBus.on('element.changed', (event) => {
      // If the selected element changed, refresh its state to update the panel
      if (selectedElement && event.element.id === selectedElement.id) {
        // Create a new object reference to trigger re-render in CustomBpmnPropertiesPanel
        setSelectedElement({ ...event.element });
      }
    });

    // Function to load a diagram (XML only)
    const loadDiagramXml = async (xml) => {
      try {
        await bpmnModelerInstance.current.importXML(xml);
        const canvas = bpmnModelerInstance.current.get('canvas');
        canvas.zoom('fit-viewport');
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error('Error importing BPMN XML:', err);
        setError(err.message || 'Failed to load BPMN diagram.');
      }
    };

    // Load the default empty diagram
    loadDiagramXml(emptyBpmnDiagram);

    // Cleanup on component unmount
    return () => {
      if (bpmnModelerInstance.current) {
        bpmnModelerInstance.current.destroy();
        bpmnModelerInstance.current = null;
      }
    };
  }, []); // Empty dependency array to run only on mount and unmount

  const handleUpdateCustomProperties = (element, properties) => {
    if (bpmnModelerInstance.current && element) {
      const modeling = bpmnModelerInstance.current.get('modeling');
      const moddle = bpmnModelerInstance.current.get('moddle');
      const businessObject = element.businessObject;

      // Filter out undefined properties to avoid setting them explicitly as empty strings
      // or to remove them if they were previously set.
      const validProperties = {};
      for (const key in properties) {
        if (properties[key] !== undefined) {
          validProperties[key] = properties[key];
        } else {
          // If property is undefined, we want to remove it from businessObject
          // For Moddle, setting a property to undefined removes it.
          validProperties[key] = undefined;
        }
      }
      
      console.log("Updating BO with:", validProperties);

      modeling.updateModdleProperties(element, businessObject, validProperties);
      // Note: updateModdleProperties directly modifies the businessObject.
      // The 'element.changed' event should be triggered by bpmn-js,
      // which will then update the selectedElement state and re-render the panel.
    }
  };

  const handleSaveSchemas = (newSchemas) => {
    setAttributeSchemas(newSchemas);
    // Optional: Save newSchemas to localStorage or backend here
    console.log("Custom attribute schemas updated:", newSchemas);
  };

  const saveDiagram = async () => {
    if (bpmnModelerInstance.current) {
      try {
        const { xml } = await bpmnModelerInstance.current.saveXML({ format: true });
        
        const workflowData = {
          bpmnXml: xml,
          attributeSchemas: attributeSchemas 
        };

        const jsonString = JSON.stringify(workflowData, null, 2);
        const encodedData = encodeURIComponent(jsonString);
        const link = document.createElement('a');
        link.setAttribute('href', 'data:application/json;charset=UTF-8,' + encodedData);
        link.setAttribute('download', 'workflow_with_attributes.bpmn.json'); // New file extension
        link.click();
        console.log('Saved BPMN XML and Schemas:', workflowData);
      } catch (err) {
        console.error('Error saving BPMN XML and Schemas:', err);
        setError(err.message || 'Failed to save BPMN diagram and schemas.');
      }
    }
  };

  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          // Clear current selection and error before starting import
          setSelectedElement(null); 
          setError(null);

          const fileContent = e.target.result;
          const importedData = JSON.parse(fileContent);

          if (importedData && typeof importedData.bpmnXml === 'string' && typeof importedData.attributeSchemas === 'object') {
            // Set attribute schemas first
            setAttributeSchemas(importedData.attributeSchemas);
            
            // Then, load BPMN XML
            await bpmnModelerInstance.current.importXML(importedData.bpmnXml);
            
            // After import, zoom to fit viewport. Selection remains null.
            // The user will need to click an element to select it again.
            const canvas = bpmnModelerInstance.current.get('canvas');
            canvas.zoom('fit-viewport');
            
            console.log("Workflow and schemas imported successfully.");
          } else {
            throw new Error("Invalid file format. Expected JSON with bpmnXml and attributeSchemas.");
          }
        } catch (err) {
          console.error('Error importing workflow file:', err);
          setError(err.message || 'Failed to import workflow file.');
          alert(`Error: ${err.message}`); // Provide feedback to the user
        }
      };
      reader.onerror = () => {
        const importError = 'Failed to read the imported file.';
        console.error(importError);
        setError(importError);
        alert(`Error: ${importError}`);
      };
      reader.readAsText(file);
    }
    // Reset file input to allow importing the same file again if needed
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const triggerFileImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div style={containerStyle}>
      {error && <div style={{ color: 'red', padding: '10px', position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'lightpink', zIndex: 100 }}>Error: {error}</div>}
      <div ref={modelerRef} style={modelerContainerStyle}>
        {/* Button to open schema definition modal */}
        <button 
          style={defineAttrsButtonStyle} 
          onClick={() => setIsSchemaModalOpen(true)}
        >
          Define Custom Attributes
        </button>
      </div>
      <CustomBpmnPropertiesPanel
        selectedElement={selectedElement}
        attributeSchemas={attributeSchemas}
        onUpdateCustomProperties={handleUpdateCustomProperties}
      />
      <SchemaDefinitionModal
        isOpen={isSchemaModalOpen}
        onClose={() => setIsSchemaModalOpen(false)}
        currentSchemas={attributeSchemas}
        onSaveSchemas={handleSaveSchemas}
      />
      {/* Hidden file input for import */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileImport}
        accept=".bpmn.json,application/json" // Specify accepted file types
      />
      {/* Import Button */}
      <button 
        onClick={triggerFileImport} 
        style={{ position: 'absolute', top: '10px', right: '400px', zIndex: 10, padding: '8px 15px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Import Diagram
      </button>
      {/* Save Button: */}
      <button onClick={saveDiagram} style={{ position: 'absolute', top: '10px', right: '230px', zIndex: 10, padding: '8px 15px' }}>
        Save Diagram
      </button>
    </div>
  );
};

export default BpmnModelerComponent;
