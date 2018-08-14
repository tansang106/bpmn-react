import { combineReducers } from 'redux';
import test from './test';
import processDefinition from './processDefinition';
import {incidentList,currentUserTask} from './incidentList';
import currentDiagram from './currentDiagram';
const appReducers = combineReducers({
    test,
    processDefinition,
    incidentList,
    currentDiagram,
    currentUserTask
})

export default appReducers;