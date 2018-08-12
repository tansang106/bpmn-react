import React from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';
import fileDownload from 'react-file-download';
import FileOpen from 'react-files';
const newXML = `<?xml version="1.0" encoding="UTF-8"?><bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn"><bpmn2:process id="Process_1" isExecutable="false"><bpmn2:startEvent id="StartEvent_1"/></bpmn2:process><bpmndi:BPMNDiagram id="BPMNDiagram_1"><bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1"><bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1"><dc:Bounds height="36.0" width="36.0" x="412.0" y="240.0"/></bpmndi:BPMNShape></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn2:definitions>`;

export default class ModelerComponent extends React.Component {
  constructor() {
    super()
    this.modeler = '';
  }
  componentDidMount() {
    this.modeler = new BpmnModeler({
      height: 600,
      container: '#modeler',
      propertiesPanel: {
        parent: '#properties'
      },
      additionalModules: [
        propertiesPanelModule,
        propertiesProviderModule
      ],
      moddleExtensions: {
        camunda: camundaModdleDescriptor
      }
    });
    this.openDiagram(newXML);
  }
  openDiagram = (xml) => {
    this.modeler.importXML(xml, function (err) {
      if (err) {
        console.error(err);
      }
    });
  }
  saveDiagram = (bpmnModeler) => {
    bpmnModeler.saveXML({ format: true }, function (err, xml) {
      let index = xml.indexOf('process id="') + 12;
      let name = '';
      for (index; xml[index] != '"' ;index++) {
        name += xml[index];
      }
      fileDownload(xml, name + '.bpmn');
    });
  }
  onFileChange = (files) => {
    var reader = new FileReader();
    reader.readAsText(files[0]);
    reader.onload = (file) => {
      const xml = file.target.result;
      this.openDiagram(xml);
    };
  }
  render() {
    return(
      <div>
        <img 
          id="imgBack"
          onClick={() => this.props.back()} 
          src="https://t3.ftcdn.net/jpg/00/96/19/60/240_F_96196051_KArAA3FUiYpbbk4SFgzfsCV6jmAnM9WW.jpg"
          style={{width: '60px', height: '60px', marginLeft: '10px'}}
        />
        <button>
        <FileOpen
          onChange={this.onFileChange}
          onError={() => alert(`can't open this file`)}
          accepts={['.bpmn']}
          maxFiles={1}
          maxFileSize={100000}
        >
          Open
        </FileOpen>
        </button>
        <button style={{position: 'fixed', 
        left: '20px', 
        bottom: '20px', 
        height: '50px', 
        width: '100px',
        zIndex: '99'
        }}
          onClick={() => this.saveDiagram(this.modeler)}
        >
          Save
        </button>
        {/* */}
        <div id="modeler"/>
        <div id="properties"/>
        {/* */}
      </div>
    );
  }
}