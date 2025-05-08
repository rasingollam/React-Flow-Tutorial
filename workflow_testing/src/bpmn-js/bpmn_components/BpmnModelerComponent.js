import React, { useEffect, useRef, useState } from 'react';
import BpmnJS from 'bpmn-js/lib/Modeler';

// Import our new custom properties panel
import CustomBpmnPropertiesPanel from './CustomBpmnPropertiesPanel'; // Import the new panel

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
  // borderRight: '1px solid #ccc', // No longer needed if panel is separate or styled differently
  backgroundColor: '#fff',
};

// propertiesPanelContainerStyle is no longer needed as we have a new custom panel component

const BpmnModelerComponent = () => {
  const modelerRef = useRef(null);
  // propertiesPanelRef is no longer needed
  const bpmnModelerInstance = useRef(null);
  const [error, setError] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null); // State for the selected element

  useEffect(() => {
    if (!modelerRef.current) {
      return;
    }

    // Initialize BpmnJS modeler
    bpmnModelerInstance.current = new BpmnJS({
      container: modelerRef.current,
      // propertiesPanel: { // This configuration is removed
      //   parent: propertiesPanelRef.current
      // },
      // additionalModules: [ // These are removed as we are not using the default properties panel
      //   BpmnPropertiesPanelModule,
      //   BpmnPropertiesProviderModule,
      //   { __init__: ['customPropertiesProvider'], customPropertiesProvider: ['type', CustomPropertiesProvider] }
      // ],
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

    // Function to load a diagram
    const loadDiagram = async (xml) => {
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
    loadDiagram(emptyBpmnDiagram);

    // Cleanup on component unmount
    return () => {
      if (bpmnModelerInstance.current) {
        bpmnModelerInstance.current.destroy();
        bpmnModelerInstance.current = null;
      }
    };
  }, []); // Empty dependency array to run only on mount and unmount

  // Example function to save the diagram (you can trigger this via a button)
  // const saveDiagram = async () => {
  //   if (bpmnModelerInstance.current) {
  //     try {
  //       const { xml } = await bpmnModelerInstance.current.saveXML({ format: true });
  //       console.log('Saved BPMN XML:', xml);
  //       // Here you can trigger a download or send to a server
  //       const encodedData = encodeURIComponent(xml);
  //       const link = document.createElement('a');
  //       link.setAttribute('href', 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData);
  //       link.setAttribute('download', 'diagram.bpmn');
  //       link.click();
  //     } catch (err) {
  //       console.error('Error saving BPMN XML:', err);
  //       setError(err.message || 'Failed to save BPMN diagram.');
  //     }
  //   }
  // };

  return (
    <div style={containerStyle}>
      {error && <div style={{ color: 'red', padding: '10px', position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'lightpink', zIndex: 100 }}>Error: {error}</div>}
      <div ref={modelerRef} style={modelerContainerStyle}></div>
      {/* Render our new custom properties panel */}
      <CustomBpmnPropertiesPanel selectedElement={selectedElement} />
      {/* Example Save Button:
      <button onClick={saveDiagram} style={{ margin: '10px', padding: '8px 15px' }}>
        Save BPMN Diagram
      </button>
      */}
    </div>
  );
};

export default BpmnModelerComponent;
