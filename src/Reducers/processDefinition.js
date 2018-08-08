import { DEPLOY, GET_PROCESS_DEFINITION, START_PROCESS_DEFINITION } from '../Actions/processDefinition';
import moment from 'moment';
var initialState = [];


export default (state = initialState, action) => {
    switch (action.type) {
        case DEPLOY:
            return [...state];
        case GET_PROCESS_DEFINITION:
            state = action.data
            return [...state];
        case START_PROCESS_DEFINITION:
            let data = JSON.parse(localStorage.getItem('PROCESS'));
            var dataProcess = data ? data : [];
            var newInstance = {
                processInstanceId: action.data.id,
                definitionKey: action.key,
                date: moment().format("DD-MM-YYYY hh:mm:ss"),
                id: action.code
            }
            dataProcess.push(newInstance)
            localStorage.setItem('PROCESS', JSON.stringify(dataProcess));
            return [...state];
        default: return [...state];
    }
};