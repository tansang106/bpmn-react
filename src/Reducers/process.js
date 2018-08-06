import { DEPLOY, GET_PROCESS, START_PROCESS } from '../Actions/process';
import moment from 'moment';
// var data = JSON.parse(localStorage.getItem('PROCESS'));
// var initialState = data ? data : [];
var initialState = [];


const process = (state = initialState, action) => {
    console.log(action)
    switch (action.type) {
        case DEPLOY:
            // state.push(action.data);
            // localStorage.setItem('PROCESS', JSON.stringify(state))
            return [...state];
        case GET_PROCESS:
            state = action.data
            return [...state];
        case START_PROCESS:
            // var data = [];
            let data = JSON.parse(localStorage.getItem('PROCESS'));
            // state = JSON.parse(localStorage.getItem('PROCESS'));
            var dataProcess = data ? data : [];
            var process = {
                processInstanceId: action.data.id,
                definitionKey: action.key,
                date: moment().format("YYYY-MM-DD HH:mm:ss"),
                id: action.code
            }
            dataProcess.push(process)
            localStorage.setItem('PROCESS', JSON.stringify(dataProcess));
            return [...state];
        default: return [...state];
    }
};

export default process; 