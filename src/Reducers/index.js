import { combineReducers } from 'redux';
import test from './test';
import process from './process';
import incidentList from './incidentList';
import currentDiagram from './currentDiagram';
const appReducers = combineReducers({
    test,
    process,
    incidentList,
    currentDiagram
})

export default appReducers;