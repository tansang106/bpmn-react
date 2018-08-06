import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { connect } from 'react-redux';
import { deployProcessRequest } from './Actions/process';
import DiagramComponent from './Components/DiagramComponent';
import IncidentList from './Components/IncidentList';
import InformationComponent from './Components/InformationComponent';
import {
  changeDiagramAction, 
  getInstanceHistoryAction,
  getInstanceInfoAction,
  getInstanceChildnodeAction,
  getDiagramXMLAction,
  choosingTaskAction
} from './Actions/currentDiagram';
import { deployProcess, getProcess, startProcess } from './Actions/process';
import Modal from '@material-ui/core/Modal';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import moment from 'moment';

const styles = theme => ({
    root: {
        // flexGrow: 1,
        width: '100%',
        // maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
        maxHeight: 250,
    },
    flex: {
        flexGrow: 10,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 1,
    },
    buttonRight: {
        marginLeft: 2
    },
    button: {
        margin: theme.spacing.unit,
    },
    input: {
        display: 'none',
    },
    paper: {
        position: 'absolute',
        width: theme.spacing.unit * 50,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
    },

});

// function rand() {
//     return Math.round(Math.random() * 20) - 10;
// }

function getModalStyle() {
    // const top = 50 + rand();
    // const left = 50 + rand();
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: '',
      open: false
    }
    this.interval = ''
  }
  handleOpen = () => {
       this.setState({ open: true });
   };

    handleClose = () => {
        this.setState({ open: false });
    };

    componentDidMount() {
        this.props.getProcess();
    }

    onChange = async (e) => {
        await this.setState({
            image: e.target.files[0]
        })
        var formData = new FormData();
        formData.append("upload", this.state.image);
        this.props.deployProcess(formData);
    }


    onClickStart = (keyProcess) => {
        let code = moment().unix()
        let data = {
            "variables": {
                "incidentID": { "value": code }
            }
        }
        this.props.startProcess(keyProcess, data, code);
        this.handleClose();
    }

    showTask = (process, classes) => {
        let result = null;
        if (process.length > 0) {
            result = process.map((item, index) => {
                let nameTask = (item.name) ? item.name : item.key
                return (
                    <ListItem button key={index} onClick={() => this.onClickStart(item.key)}>
                        <ListItemText primary={nameTask} />
                    </ListItem>
                )
            })
        }
        return result;
    }
  onChangeCurrentDiagram = (processInstanceId, definitionKey) => {
    clearInterval(this.interval);
    this.props.changeDiagram({
      processInstanceId: processInstanceId,
      definitionKey: definitionKey
    });
    this.props.getDiagramXML(definitionKey);
    this.props.getInstanceHistory(processInstanceId);
    this.props.getInstanceInfo(processInstanceId);

    this.interval = setInterval(() => {
      this.props.getInstanceHistory(processInstanceId);
      this.props.getInstanceInfo(processInstanceId);
    }, 5000);
  }
  onClickGetTaskInformation = (chosenTaskId) => {
    let isActive = false;
    const {instanceChildnode} = this.props.currentDiagram;
    if(instanceChildnode.childActivityInstances) {
      instanceChildnode.childActivityInstances.map(c => {
        if (c.activityId == chosenTaskId) {
          isActive = true;
        }
      });
    }
    this.props.choosingTask(chosenTaskId, this.props.currentDiagram.instanceHistory, isActive);
  }
  render() {
    const { 
      classes, 
      incidentList, 
      currentDiagram,
      process
      } = this.props;
    return (
      <div className="App">
         <AppBar position="static">
                    <Toolbar>
                        <IconButton className={`${classes.menuButton}`} color="inherit" aria-label="Menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="title" color="inherit" className={`${classes.flex}`}>
                            News
                        </Typography>
                        <input
                            className={classes.input}
                            id="flat-button-file"
                            type="file"
                            onChange={this.onChange}
                        />
                        <label htmlFor="flat-button-file">
                            <Button color="inherit" component="span" className={`${classes.buttonRight}`}>Deploy</Button>
                        </label>
                        <Button color="inherit" component="span" className={`${classes.buttonRight}`} onClick={this.handleOpen}>Start</Button>
                    </Toolbar>
                    <Modal
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                        open={this.state.open}
                        onClose={this.handleClose}
                    >
                        <div style={getModalStyle()} className={classes.paper}>
                            <List
                                component="nav"
                                subheader={<ListSubheader component="div">List Task</ListSubheader>}
                                className={`${classes.root}`} 
                            >
                                {/* <ListItem button>
                                    <ListItemText primary="Trash" />
                                </ListItem>
                                <ListItem button component="a" href="#simple-list">
                                    <ListItemText primary="Spam" />
                                </ListItem> */}
                                {this.showTask(process, classes)}
                            </List>
                        </div>
                    </Modal>
                </AppBar>

        <header className="App-header">
          <img src={'http://farayandgostar.com/wp-content/uploads/2016/09/2443838.png'} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Cà Mụn Đã</h1>
        </header>
        {/* Mid Start */}
        <div style={{width: '100%', height: '300px', marginBottom: '50px'}}>
          <div style={{width: '40%', 
                      float: 'left', 
                      borderStyle: 'groove', 
                      margin: '20px 0 0 0',
                      height: '300px'
                    }}>
            <div style={{height: '100px', 
                        lineHeight: '100px',
                        color: 'brown',
                        fontWeight: 'bold',
                        fontSize: '20pt'
                      }}>
              {currentDiagram.definitionKey != '' ? currentDiagram.definitionKey + ' BPMN' : ''}
            </div>
            <DiagramComponent 
              currentDiagram={currentDiagram}
              onClickGetTaskInformation={this.onClickGetTaskInformation}
            />
          </div>
          <div style={{width: '59%', float: 'left'}}>
            <IncidentList 
              data={incidentList} 
              currentInstanceID={currentDiagram.processInstanceId}
              onChangeCurrentDiagram={this.onChangeCurrentDiagram}
            />
          </div>
        </div>
        {/* Mid End */}

        {/* Bottom Start */}
        <InformationComponent data={currentDiagram.currentChosenTask}/>
        {/* Bottom End */}
      </div>
    );
  }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    return {
        process: state.process,
        incidentList: state.incidentList,
        currentDiagram: state.currentDiagram
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        deployProcess: (data) => {
            dispatch(deployProcess(data))
        },
        changeDiagram: (data) => {
          dispatch(changeDiagramAction(data))
        },
        getDiagramXML: (definitionKey) => {
          dispatch(getDiagramXMLAction(definitionKey))
        },
        getInstanceHistory: (processInstanceId) => {
          dispatch(getInstanceHistoryAction(processInstanceId))
        },
        getInstanceInfo: (processInstanceId) => {
          dispatch(getInstanceInfoAction(processInstanceId))
        },
        getInstanceChildnode: (processInstanceId) => {
          dispatch(getInstanceChildnodeAction(processInstanceId))
        },
        choosingTask: (chosenTaskId, instanceHistory, isActive) => {
          dispatch(choosingTaskAction(chosenTaskId, instanceHistory, isActive))
        },
        getProcess: () => {
            dispatch(getProcess())
        },
        startProcess: (key, data, code) => {
            dispatch(startProcess(key, data, code))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(App));
