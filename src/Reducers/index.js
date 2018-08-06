import { combineReducers } from 'redux';
import test from './test';
import processDefinition from './processDefinition';
import incidentList from './incidentList';
import currentDiagram from './currentDiagram';
const appReducers = combineReducers({
    test,
    processDefinition,
    incidentList,
    currentDiagram
})

export default appReducers;