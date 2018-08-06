import {GET_INCIDENT_LIST} from '../Contanst/ActionType.js';
import callAPI from '../Utils/callApi';

export const getListIncidentAction = () => {
	const data = JSON.parse(localStorage.getItem('PROCESS')) || [];
	let payload = [];
	data.map(d => {
		callAPI(`history/process-instance/${d.processInstanceId}`)
		.then(res => {
			payload.push({...d,status: res.data.state})
		})
	});
	return (dispatch) => {
		setTimeout(() => {
			dispatch({
				type: GET_INCIDENT_LIST,
				payload: payload
			})
		}, 2000);
	}
}