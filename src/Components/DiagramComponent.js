import React from 'react'
import BpmnViewer from 'bpmn-js'
import axios from 'axios';
import './diagram-js.css';
class bpmnView extends React.Component{
  constructor(){
    super();
    this.state = {
      modalIsOpen: false
    }
    this.viewer = new BpmnViewer({height: 200});
  }
  componentDidMount(){
    this.viewer.attachTo('#Bpmn');
    let eventBus = this.viewer.get('eventBus');
    eventBus.on('element.click', (e) => {
      this.props.onClickGetTaskInformation(e.element.id);
    });
  }
  componentDidUpdate() {
    const {
      instanceChildnode,
      instanceHistory,
      instanceInfo,
      xml
    } = this.props.currentDiagram;
    if (xml.bpmn20Xml && xml.id.includes(instanceInfo.processDefinitionKey) && 
        xml.id.includes(instanceHistory[0].processDefinitionKey)) {
      this.importXML(xml.bpmn20Xml, this.viewer, instanceHistory, instanceInfo, instanceChildnode)
    }
  }
  render(){
    return (
      <div id="Bpmn"></div>
    );
  }
  importXML = (xml, Viewer, instanceHistory, instanceInfo, instanceChildnode) => {
      const history = instanceHistory.map(h => h.activityId);
      let currentTask = null;
      if(instanceInfo.state != 'COMPLETED' && instanceChildnode.childActivityInstances) {
        currentTask = instanceChildnode.childActivityInstances.map(c => c.activityId);
        currentTask = currentTask[0];
      }
      Viewer.importXML(xml, function(err) {
        if (err) {
          return console.error('could not import BPMN 2.0 diagram', err);
        }
        var canvas = Viewer.get('canvas'),
            overlays = Viewer.get('overlays');
        // zoom to fit full viewport
        canvas.zoom('fit-viewport', 'auto');
        history.map(h => {
          if(h != currentTask) {
            canvas.addMarker(h, 'complete');
          }
        })
        if (currentTask) {
            canvas.addMarker(currentTask, 'currentTask');
        }
      });
    }
}
export default bpmnView;