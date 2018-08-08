import {GET_INCIDENT_LIST} from '../Contanst/ActionType.js';
// var data = JSON.parse(localStorage.getItem('PROCESS'));
// var initialState = data ? data : [];
const initialState = [];

export default (state = initialState, action) => {
    switch (action.type) {
    	case GET_INCIDENT_LIST:
    		var length = action.payload.length;
    		let newState = action.payload;
    		for (var i = 0; i < length - 1; i++) {
    			for (var j = i + 1; j < length; j++) {
    				if (newState[i].id > newState[j].id) {
    					let temp = newState[i];
    					newState[i] = newState[j];
    					newState[j] = temp;
    				}
    			}
    		}
    		return newState;
        default: 
            return state;
    }
};