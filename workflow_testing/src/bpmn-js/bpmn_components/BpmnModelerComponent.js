import React, { useEffect, useRef, useState } from 'react';
import BpmnJS from 'bpmn-js/lib/Modeler';

// Import BPMN-JS CSS files
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

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

const modelerContainerStyle = {
  height: 'calc(100vh - 100px)', // Adjust based on your layout, assuming some header/footer space
  width: '100%',
  border: '1px solid #ccc',
  backgroundColor: '#fff',
};

const BpmnModelerComponent = () => {
  const modelerRef = useRef(null);
  const bpmnModelerInstance = useRef(null);
  const [error, setError] = useState(null);

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
    <>
      {error && <div style={{ color: 'red', padding: '10px' }}>Error: {error}</div>}
      <div ref={modelerRef} style={modelerContainerStyle}></div>
      {/* Example Save Button:
      <button onClick={saveDiagram} style={{ margin: '10px', padding: '8px 15px' }}>
        Save BPMN Diagram
      </button>
      */}
    </>
  );
};

export default BpmnModelerComponent;
