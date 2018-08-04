const {
    Client,
    logger,
    Variables
  } = require("camunda-external-task-client-js");
  
const config = { baseUrl: "http://localhost:8080/engine-rest", use: logger };
const client = new Client(config);
//     //await taskService.handleFailure(task, "some failure message");
//     //await taskService.extendLock(task, 5000);
//     //await taskService.unlock(task);
client.subscribe("AlarmtoSCCD", async ({task, taskService}) => {
    console.log("Alarm to SCCD", task.variables.get("incidentID"));
    await taskService.complete(task);
})
client.subscribe("PhonetoBoss", async ({task, taskService}) => {
    console.log("Phone to Boss", task.variables.get("incidentID"));
    const processVariables = new Variables();
    processVariables.set("status", "false");
    await taskService.complete(task, processVariables);
})
client.subscribe("LoggerIncident", async ({task, taskService}) => {
    console.log("Logger Incident", task.variables.get("incidentID"));
    await taskService.complete(task);
})
client.subscribe("SendEscalateEmail", async ({task, taskService}) => {
    console.log("Send EscalateEmail", task.variables.get("incidentID"), task.variables.get("status"));
    await taskService.complete(task);
})