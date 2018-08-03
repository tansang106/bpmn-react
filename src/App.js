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
            open: false,
        }
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

    render() {
        const { classes, process } = this.props;
        console.log(process)
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
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome to React</h1>
                </header>

                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload.
          <input type="file" onChange={this.onChange} />
                    <button onClick={this.onClick}>Click</button>
                </p>

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
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        deployProcess: (data) => {
            dispatch(deployProcess(data))
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
