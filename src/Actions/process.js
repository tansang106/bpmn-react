import callAPI from '../Utils/callApi';
import toastr from 'toastr';

export const DEPLOY = 'DEPLOY';
export const GET_PROCESS = 'GET_PROCESS';

export const deployProcessRequest = (data) => {
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

export const countProcess = () => {
    return (dispatch) => {
        return callAPI('process-definition?latest=true&active=true&firstResult=0&maxResults=20', 'GET').then(res => {
            try {
                console.log(res)
                if (res.status === 200) {
                    return dispatch({
                        type: GET_PROCESS,
                        data: res.data
                    })
                }
            } catch (error) {
                
            }
        })
    }
}



