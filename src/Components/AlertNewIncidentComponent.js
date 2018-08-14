import React from 'react';
export default class AlertNewIncident extends React.Component {
  componentDidMount(){
    setInterval(() => this.props.getCurrentUserTask(), 3000);
  }
  render() {
    const {currentUserTask, completeUserTask} = this.props;
    if (currentUserTask.length > 0) {
    return (
      <div className="alert">
      <img src="http://2.bp.blogspot.com/-mxAwi5zynAA/VQVFqfKZqmI/AAAAAAAAL6o/9zqIKf8nY6k/s1600/Apps-Notifications-icon.png" />
      <div className="alert-content">
      {currentUserTask.map(c => (
        <div key={c.ticketCode}>
          <div style={{float: 'left'}}>
          <div>{c.ticketCode + ' '}</div>
          <div>{c.date + ' '}</div>
          </div>
           <button  
            onClick={() => completeUserTask(c.taskId, c.ticketCode, c.definitionKey, c.processInstanceId)}>
            Accept
          </button>
        </div>
      ))}
      </div>
      </div>
    );
    }
    else {
      return(<React.Fragment></React.Fragment>);
    }
  }
}