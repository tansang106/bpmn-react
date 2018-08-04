import {CHANGE_DIAGRAM,
		GET_INSTANCE_HISTORY,
		GET_INSTANCE_INFO,
		GET_INSTANCE_CHILDNODE,
		GET_DIAGRAM_XML,
		CHOOSING_TASK
} from '../Contanst/ActionType.js';

const initialState = {
	processInstanceId: '',
	definitionKey: '',
	instanceHistory: [],
	instanceInfo: {},
	instanceChildnode: [],
	xml: {},
	currentChosenTask: []
}

export default (state = initialState, action) => {
	switch(action.type) {
		case CHANGE_DIAGRAM:
			return {
				...state,
				processInstanceId: action.payload.processInstanceId,
				definitionKey: action.payload.definitionKey,
				currentChosenTask: []
			}
		case GET_DIAGRAM_XML:
			return {
				...state,
				xml: action.payload
			}
		case GET_INSTANCE_HISTORY:
			return {
				...state,
				instanceHistory: action.payload
			}
		case GET_INSTANCE_INFO:
			return {
				...state,
				instanceInfo: action.payload
			}
		case GET_INSTANCE_CHILDNODE:
			return {
				...state,
				instanceChildnode: action.payload
			}
		case CHOOSING_TASK:
			return {
				...state,
				currentChosenTask: action.payload
			}
		default:
			return state;
	}
}