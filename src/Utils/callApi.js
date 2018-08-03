import axios from 'axios';
import * as Config from '../Contanst/Config';

export default function callApi(endpoint, method = 'GET', body, header) {
    return axios({
        method: method,
        url: `${Config.API_URL}/${endpoint}`,
        data: body,
        headers: header
    }).catch(err => {
        console.log(err);
    });
}