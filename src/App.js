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


const styles = theme => ({
  root: {
    flexGrow: 1,
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
});

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      image: '',
    }
  }

  onChange = async (e) => {
    await this.setState({
      image: e.target.files[0]
    })
    var formData = new FormData();
    formData.append("upload", this.state.image);
    this.props.deployProcess(formData);
  }
  


    onClickStart = (e) => {
        e.preventDefault();

    }

  render() {
    const { classes } = this.props;
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
                <Button color="inherit" component="span" className={`${classes.buttonRight}`} onClick={this.onClickStart}>Start</Button>        
          </Toolbar>
        </AppBar>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
          <input type="file" onChange={this.onChange}/>
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
        process: state.process
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        deployProcess: (data) => {
            dispatch(deployProcessRequest(data))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(App));
