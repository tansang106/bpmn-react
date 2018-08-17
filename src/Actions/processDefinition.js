import callAPI from '../Utils/callApi';
import toastr from 'toastr';
import sccdAPI from '../Utils/sccdApi';
import moment from 'moment';
export const DEPLOY = 'DEPLOY';
export const GET_PROCESS_DEFINITION = 'GET_PROCESS_DEFINITION';
export const START_PROCESS_DEFINITION = 'START_PROCESS_DEFINITION';

export const deployProcessDefinition = (data) => {
    return (dispatch) => {
        return callAPI('deployment/create',
            'POST', data, { 'Content-Type': ['multipart/form-data'] }).then(res => {
                try {
                    if (res.status === 200) {
                        toastr.success('Deploy success', 'Success')
                        return dispatch({
                            type: DEPLOY,
                            data: res.data
                        })
                        
                    } else {
                        console.log(res)
                    }
                } catch (error) {
                    console.log('Error Deploy', error)
                }
                    
            }) 
    }
}

export const getProcessDefinition = () => {
    return (dispatch) => {
        return callAPI('process-definition?latest=true&active=true&firstResult=0&maxResults=20', 'GET').then(res => {
            try {
                if (res.status === 200) {
                    return dispatch({
                        type: GET_PROCESS_DEFINITION,
                        data: res.data
                    })
                } else {
                    console.log(res)
                }
            } catch (error) {
                console.log(res)
            }
        })
    }
}

export const startProcessDefinition = (definitionKey) => async (dispatch) => {
    let ticketCode = await sccdAPI(`search-ticket-camunda?api_key=n96M1TPG821EdN4mMIjnGKxGytx9W2UJ&processInstanceId=0`,
        'GET',{},{});
    ticketCode = await JSON.parse(ticketCode.data.data) || null;
    if (ticketCode && ticketCode.hits.length > 0) {
        ticketCode = await ticketCode.hits[0]._source;
        const date = moment(ticketCode['@timestamp']).format('DD-MM-YYYY HH:mm:ss');
        ticketCode = ticketCode.TicketCode;

        const data = {
            "variables": {
                "incidentID": {"value": ticketCode}
            }
        };
        let processInstanceId = (await callAPI(`process-definition/key/${definitionKey}/start`,'POST', data, {})).data.id;
        await sccdAPI(`listen-camunda/log-action?api_key=e3708c4e68dc2654d1c93c91c751284d`, 'POST',
        {
            ticketCode,
            definitionKey,
            processInstanceId
        },{}).then(res => {
            toastr.success('Start Process Success', 'Success');
            dispatch({
                type: 'ADD_INCIDENT',
                payload: {
                    id: ticketCode,
                    definitionKey,
                    processInstanceId,
                    date,
                    status: 'ACTIVE'
                }
            })
        })
        .catch(err => console.log(err));
    } else {
        toastr.error('Empty ticket', 'Error');
    }
}