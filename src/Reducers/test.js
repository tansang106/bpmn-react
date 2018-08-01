import * as Types from '../Contanst/ActionType';
var initialState = [
    {
        name: 'value'
    }
];

const test = (state = initialState, action) => {
    switch (action.type) {
        case Types.TEST:
            return [...state];
        default:
            return [...state]
    }
}


export default test;