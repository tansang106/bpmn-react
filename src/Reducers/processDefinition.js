import { DEPLOY, GET_PROCESS_DEFINITION, START_PROCESS_DEFINITION } from '../Actions/processDefinition';
var initialState = [];


export default (state = initialState, action) => {
    switch (action.type) {
        case DEPLOY:
            return [...state];
        case GET_PROCESS_DEFINITION:
            state = action.data
            return [...state];
        default: return [...state];
    }
};