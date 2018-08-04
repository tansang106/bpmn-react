
var initialState = [
{
    id: 'SCC001', 
    date: '2018-08-03 15:25:00', 
    definitionKey: 'ResolveIncident', 
    processInstanceId: 'aeae2734-96f6-11e8-a45f-9e2a70d7aa1b',
    status: 'COMPLETED'
},
{
    id: 'SCC002',
    date: '2018-08-03 15:40:00', 
    definitionKey: 'ResolveIncident', 
    processInstanceId: 'dd6a91ec-96f6-11e8-a45f-9e2a70d7aa1b',
    status: 'COMPLETED'
},
{
    id: 'SCC003',
    date: '2018-08-03 16:00:00',
    definitionKey: 'ResolveIncident', 
    processInstanceId: 'ce804a3e-96f8-11e8-a45f-9e2a70d7aa1b',
    status: 'ACTIVE'
}
]

export default (state = initialState, action) => {
    switch (action.type) {
        default: 
            return state;
    }
};