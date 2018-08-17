const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(3000, () => console.log('SERVER run port 3000'));
// service worker
const {
    Client,
    logger,
    Variables
  } = require("camunda-external-task-client-js");
const moment = require("moment");
const config = { baseUrl: "http://42.116.254.246:8080/engine-rest", use: logger };
const client = new Client(config);
const axios = require("axios");
const fs = require("fs");
//     //await taskService.handleFailure(task, "some failure message");
//     //await taskService.extendLock(task, 5000);
//     //await taskService.unlock(task);
client.subscribe("AlarmtoSCCD", async ({task, taskService}) => {
    console.log("Alarm to SCCD", task.variables.get("incidentID"));

    await taskService.complete(task);
})


client.subscribe("PhonetoBoss", async ({task, taskService}) => {
    const incidentID = task.variables.get("incidentID");
    console.log("Phone to Boss", incidentID);
    axios(`http://42.116.254.238:33333/call-phone-camunda?api_key=n96M1TPG821EdN4mMIjnGKxGytx9W2UJ&number=0937378973&provider=mobile&text='We are have new incident ${incidentID}'`)
    .then(response => {
        const processVariables = new Variables();
        if (response.data.status == 200) {
            //shoud true, false because test email
            processVariables.set("status", "true");
            processVariables.set("log", `incidentID ${incidentID} is automatically phoned to boss at ${moment().format("DD-MM-YYYY hh:mm:ss")}`);
        }
        else {
            processVariables.set("status", "false");
        }
        taskService.complete(task, processVariables);
    })
})



client.subscribe("LoggerIncident", async ({task, taskService}) => {
    const incidentID = task.variables.get("incidentID");
    const log = task.variables.get("username") ? `incidentID ${incidentID} was authenticated by ${task.variables.get("username")} at ${moment().format("DD-MM-YYYY hh:mm:ss")}` : 
        task.variables.get("log");
    console.log('logger', log);
    var logger = fs.createWriteStream('log.txt', {
        flags: 'a+'
    })
    logger.write(log + '\r\n');
    logger.end();
    await taskService.complete(task);
})



client.subscribe("SendEscalateEmail", async ({task, taskService}) => {
    console.log('Send email!!!', task.variables.get("incidentID"));
    axios('http://42.116.254.238:33333/send-mail-camunda?api_key=n96M1TPG821EdN4mMIjnGKxGytx9W2UJ', {
        method: 'POST',
        data: {
            TicketCode: task.variables.get("incidentID"),
            Msg: 'Alarm from Camunda',
            MailTo: 'baotm2@fpt.com.vn',
            MailCC: '',
            Telegram: ''
        }
    }).then(res => {
        console.log('Send mail succesfully!!!', res.data);
        taskService.complete(task);
    })
})