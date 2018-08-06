import callAPI from '../Utils/callApi';
import toastr from 'toastr';

export const DEPLOY = 'DEPLOY';
export const GET_PROCESS = 'GET_PROCESS';
export const START_PROCESS = 'START_PROCESS';

export const deployProcess = (data) => {
    return (dispatch) => {
        return callAPI('deployment/create',
            'POST', data, { 'Content-Type': ['multipart/form-data'] }).then(res => {
                try {
                    console.log(res)
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

export const getProcess = () => {
    return (dispatch) => {
        return callAPI('process-definition?latest=true&active=true&firstResult=0&maxResults=20', 'GET').then(res => {
            try {
                console.log(res)
                if (res.status === 200) {
                    return dispatch({
                        type: GET_PROCESS,
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

export const startProcess = (key, data, code) => {
    return (dispatch) => {
        return callAPI(`process-definition/key/${key}/start`,
            'POST', data, {}).then(res => {
                try {
                    console.log(res)
                    if (res.status === 200) {
                        toastr.success('Start Process Success', 'Success')
                        return dispatch({
                            type: START_PROCESS,
                            data: res.data,
                            key: key,
                            code: code
                        })

                    } else {
                        console.log(res)
                    }
                } catch (error) {
                    console.log('Error Start Process', error)
                }

            })
    }
}



