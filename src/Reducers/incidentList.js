import {GET_INCIDENT_LIST} from '../Contanst/ActionType.js';
// var data = JSON.parse(localStorage.getItem('PROCESS'));
// var initialState = data ? data : [];
const initialState = [];

export default (state = initialState, action) => {
    switch (action.type) {
    	case GET_INCIDENT_LIST:
    		return action.payload;
        default: 
            return state;
    }
};