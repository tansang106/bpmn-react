import {CHANGE_DIAGRAM,
		GET_INSTANCE_HISTORY,
		GET_INSTANCE_INFO,
		GET_INSTANCE_CHILDNODE,
		GET_DIAGRAM_XML,
		CHOOSING_TASK
} from '../Contanst/ActionType';
import callAPI from '../Utils/callApi';
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
				{key: 'Activity ID',value: eachModel.activityId},
				{key: 'Activity Name',value: eachModel.activityName},
				{key: 'Activity Type',value: eachModel.activityType},
				{key: 'Process Instance ID',value: eachModel.processInstanceId},
				{key: 'Task ID',value: eachModel.taskId},
				{key: 'Execution ID',value: eachModel.executionId},
				{key: 'Start Time',value: eachModel.startTime}
			];
			if (eachModel.activityType == 'userTask' && isActive) {
				data.unshift({
					key: 'Complete User Task',
					value: () => completeUserTask(eachModel.taskId)
				})
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
	callAPI(`task/${taskId}/complete`,
			'POST',
			{
				"variables": {
					"username": {"value": "admin"}
				}
			},
			{});
	document.getElementById('completeTaskButton').disabled = true;
	alert('Đã gửi request!');
}