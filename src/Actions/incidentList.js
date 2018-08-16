import {GET_INCIDENT_LIST, GET_CURRENT_USER_TASK} from '../Contanst/ActionType.js';
import callAPI from '../Utils/callApi';
import sccdAPI from '../Utils/sccdApi';
import moment from 'moment';
export const getListIncidentAction = () => async (dispatch) => {
	let payload = [];
	let data = (await sccdAPI('search-ticket-camunda?api_key=n96M1TPG821EdN4mMIjnGKxGytx9W2UJ&processInstanceId=1', 
		'GET',{}, {})).data;
	data = (await JSON.parse(data.data)).hits;
	data.map(async d => {
		let status = (await callAPI(`history/process-instance/${d._source.processInstanceId}`));
		if (status) {
			status = await status.data.state;
		}
		payload.push({
			id: d._source.TicketCode,
			date: moment(d._source.IssueDate).format("DD-MM-YYYY hh:mm:ss"),
			definitionKey: d._source.definitionKey,
			processInstanceId: d._source.processInstanceId,
			status: status
		})
	})
	setTimeout( () => dispatch({
		type: GET_INCIDENT_LIST,
		payload: payload
	}) , 500)
}

export const getCurrentUserTaskAction = (incidentList) => async (dispatch) => {
	let payload = [];
	if (incidentList) {
		incidentList.map(async i => {
			let res = (await callAPI(`task?processInstanceId=${i.processInstanceId}`));
			if (res) {
				res = await res.data;
				if (res.length > 0) {
					const date = moment(res[0].created).format("DD-MM-YYYY hh:mm:ss");
					payload.push({
						ticketCode: i.id,
						date,
						taskId: res[0].id,
						definitionKey: res[0].processDefinitionId.split(':')[0],
						processInstanceId: res[0].processInstanceId
					})
				}
			}
		})
	}
	setTimeout(() => dispatch({
		type: GET_CURRENT_USER_TASK,
		payload
	}), 200);
}