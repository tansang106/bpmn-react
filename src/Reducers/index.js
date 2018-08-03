import { combineReducers } from 'redux';
import test from './test';
import process from './process';

const appReducers = combineReducers({
    test,
    process
})

export default appReducers;