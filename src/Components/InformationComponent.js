import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: 14,
    fontWeight: 'bold'
  },
  body: {
    fontSize: 14,
  }
}))(TableCell);

const styles = theme => ({
  root: {
    width: '80%',
    marginLeft: '10%',
    marginTop: theme.spacing.unit * 3
  }
});

class InformationComponent extends React.Component {
  render() {
    const { classes, data } = this.props;
    if (data.length > 0) {
      return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <CustomTableCell>Key</CustomTableCell>
              <CustomTableCell>Value</CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {data.map(d => (
            <TableRow key={d.key}>
                <CustomTableCell>{d.key}</CustomTableCell>
                <CustomTableCell>{typeof(d.value) == 'function' ? (
                  <button id="completeTaskButton" onClick={d.value}>Complete Task</button>
                  ) : d.value}
                </CustomTableCell>
            </TableRow>
          ))} 
          </TableBody>
        </Table>
      </Paper>
    );
    }
    else {
      return(
        <React.Fragment />
      );
    }
  }
}

InformationComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InformationComponent);