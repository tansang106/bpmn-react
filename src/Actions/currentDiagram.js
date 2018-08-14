import {CHANGE_DIAGRAM,
		GET_INSTANCE_HISTORY,
		GET_INSTANCE_INFO,
		GET_INSTANCE_CHILDNODE,
		GET_DIAGRAM_XML,
		CHOOSING_TASK,
		COMPLETE_CURRENT_USER_TASK
} from '../Contanst/ActionType';
import callAPI from '../Utils/callApi';
import sccdAPI from '../Utils/sccdApi';
import moment from 'moment';
import toastr from 'toastr';
export const changeDiagramAction = (data) => {
    return (dispatch) => {
    	dispatch({
	        type: CHANGE_DIAGRAM,
	        payload: data
    	});
    }
}
export const getDiagramXMLAction = (definitionKey) => {
	return (dispatch) => {	
		callAPI(`process-definition/key/${definitionKey}/xml`,
			'GET',{},{})
			.then(res => {
				dispatch({
					type: GET_DIAGRAM_XML,
					payload: res.data
				})
			})
			.catch(err => console.log())
	}
}

export const getInstanceHistoryAction = (processInstanceId) => {
	return (dispatch) => {
		callAPI(`history/activity-instance?processInstanceId=${processInstanceId}`,
			'GET',{},{})
			.then(res => {
				dispatch({
					type: GET_INSTANCE_HISTORY,
					payload: res.data
				})
			})
			.catch(err => console.log())
	}
}

export const getInstanceInfoAction = (processInstanceId) => {
	return (dispatch) => {
		callAPI(`history/process-instance/${processInstanceId}`,
			'GET',{},{})
			.then(res => {
				dispatch({
					type: GET_INSTANCE_INFO,
					payload: res.data
				});
				if (res.data.state != 'COMPLETED') {
					dispatch(getInstanceChildnodeAction(processInstanceId));
				}
				else {
					dispatch(getInstanceChildnodeAction(null));
				}
			})
			.catch(err => console.log())
	}
}

export const getInstanceChildnodeAction = (processInstanceId) => {
	if (!processInstanceId) {
		return (dispatch => {
			dispatch({
				type: GET_INSTANCE_CHILDNODE,
				payload: []
			})
		})
	}
	else {
		return (dispatch) => {
			callAPI(`process-instance/${processInstanceId}/activity-instances`,
				'GET',{},{})
			.then(res => {
				dispatch({
					type: GET_INSTANCE_CHILDNODE,
					payload: res.data
				})
			}).catch(err => {
				console.log(err);
			});
		}
	}	
}

export const choosingTaskAction = (chosenTaskId, instanceHistory, isActive, TicketCode) => async (dispatch) => {
	let data = [];
	instanceHistory.map(async eachModel => {
		if (eachModel.activityId == chosenTaskId) {
			data = [
				{key: 'Activity Name',value: eachModel.activityName},
				{key: 'Start Time',value: moment(eachModel.startTime).format("DD-MM-YYYY hh:mm:ss")},
				{key: 'End Time', value: moment(eachModel.endTime).format("DD-MM-YYYY hh:mm:ss")}
			];
			if (eachModel.activityType == 'userTask') {
				if (isActive) {
					data.unshift({
						key: 'Complete User Task',
						value: () => completeUserTask(eachModel.taskId, TicketCode, eachModel.processDefinitionKey, eachModel.processInstanceId)
					})
				} else {
					let res = (await sccdAPI(`search-ticket-camunda?api_key=n96M1TPG821EdN4mMIjnGKxGytx9W2UJ&ticketCode=${TicketCode}`,'GET',{},{})).data.data;
					res = JSON.parse(res).hits[0]._source;
					res = res.username ? res.username : 'BaoTM2';
					data.unshift({
						key: 'Completed By',
						value: res
					});
				}
			}
		}
	});

	setTimeout(() => dispatch({
		type: CHOOSING_TASK,
		payload: data
	}), 100);
}

export const completeUserTask = (taskId, ticketCode, definitionKey, processInstanceId) => (dispatch) => {
	const username = "BaoTM2";
	callAPI(`task/${taskId}/complete`,
			'POST',
			{
				"variables": {
					"username": {"value": username}
				}
			},
			{}).catch(err => console.log(err));
	sccdAPI(`listen-camunda/log-action?api_key=e3708c4e68dc2654d1c93c91c751284d`, 'POST',
	{
		ticketCode,
		definitionKey,
		processInstanceId,
		username
	},{}).catch(err => console.log(err));
	dispatch({
		type: COMPLETE_CURRENT_USER_TASK,
		ticketCode
	})
	if (document.getElementById('completeTaskButton')) {
		document.getElementById('completeTaskButton').disabled = true;
	}
	toastr.success('Đã gửi request!');
}