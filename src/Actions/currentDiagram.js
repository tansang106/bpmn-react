import {CHANGE_DIAGRAM,
		GET_INSTANCE_HISTORY,
		GET_INSTANCE_INFO,
		GET_INSTANCE_CHILDNODE,
		GET_DIAGRAM_XML,
		CHOOSING_TASK
} from '../Contanst/ActionType';
import callAPI from '../Utils/callApi';
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

export const choosingTaskAction = (chosenTaskId, instanceHistory, isActive) => {
	let data = [];
	instanceHistory.map(eachModel => {
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
						value: () => completeUserTask(eachModel.taskId)
					})
				} else {
					const userTaskHistory = JSON.parse(localStorage.getItem('USER_TASK_HISTORY')) || [];
					userTaskHistory.map(u => {
						if (u.taskId == eachModel.taskId) {
							data.unshift({
								key: 'Completed By',
								value: u.username
							})
						}
					})
				}
			}
		}
	});
	return (dispatch) => {
		dispatch({
			type: CHOOSING_TASK,
			payload: data
		})
	}
}

const completeUserTask = (taskId) => {
	const username = "BaoTM2";
	callAPI(`task/${taskId}/complete`,
			'POST',
			{
				"variables": {
					"username": {"value": username}
				}
			},
			{}).then(res => {
				let data = JSON.parse(localStorage.getItem('USER_TASK_HISTORY')) || [];
				data.push({taskId, username});
				localStorage.setItem('USER_TASK_HISTORY', JSON.stringify(data));
			}).catch(err => console.log(err));
	if (document.getElementById('completeTaskButton')) {
		document.getElementById('completeTaskButton').disabled = true;
	}
	toastr.success('Đã gửi request!');
}