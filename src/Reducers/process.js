import { DEPLOY, GET_PROCESS } from '../Actions/process';
var data = JSON.parse(localStorage.getItem('PROCESS'));
var initialState = data ? data : [];

const process = (state = initialState, action) => {
    switch (action.type) {
        case DEPLOY:
            state.push(action.data);
            localStorage.setItem('PROCESS', JSON.stringify(state))
            return [...state];
        case GET_PROCESS:
            state = action.data
            return [...state];
        default: return [...state];
    }
};

export default process; 