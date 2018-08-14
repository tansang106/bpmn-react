import {GET_INCIDENT_LIST, GET_CURRENT_USER_TASK,
COMPLETE_CURRENT_USER_TASK} from '../Contanst/ActionType.js';

const initialState = [];

export const incidentList = (state = initialState, action) => {
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
        case 'ADD_INCIDENT':
            return state.concat([action.payload]);
        default: 
            return state;
    }
};

export const currentUserTask = (state = [], action) => {
    switch (action.type) {
        case GET_CURRENT_USER_TASK:
            var length = action.payload.length;
            let newState = action.payload;
            for (var i = 0; i < length - 1; i++) {
                for (var j = i + 1; j < length; j++) {
                    if (newState[i].ticketCode > newState[j].ticketCode) {
                        let temp = newState[i];
                        newState[i] = newState[j];
                        newState[j] = temp;
                    }
                }
            }
            return newState;
            break;
        case COMPLETE_CURRENT_USER_TASK:
            return state.filter(s => s.ticketCode != action.ticketCode);
        default:
            return state;
            break;
    }
}