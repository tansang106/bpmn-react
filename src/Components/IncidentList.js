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
    width: '100%',
    maxHeight: '300px',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    overflowY: 'auto'
  }
});

class CustomizedTable extends React.Component {
  render() {
    const { classes, data, currentInstanceID } = this.props;
    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <CustomTableCell>ID</CustomTableCell>
              <CustomTableCell>Date</CustomTableCell>
              <CustomTableCell>Definition Key</CustomTableCell>
              <CustomTableCell>Process Instance ID</CustomTableCell>
              <CustomTableCell>Status</CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(n => {
              return (
                <TableRow className={classes.row} key={n.id} 
                    onClick={
                      () => this.props.onChangeCurrentDiagram(n.processInstanceId, n.definitionKey)
                    }
                    style={{
                      backgroundColor: currentInstanceID == n.processInstanceId ? '#FFE680' : ''
                    }}
                >
                  <CustomTableCell>{n.id}</CustomTableCell>
                  <CustomTableCell>{n.date}</CustomTableCell>
                  <CustomTableCell>{n.definitionKey}</CustomTableCell>
                  <CustomTableCell>{n.processInstanceId}</CustomTableCell>
                  <CustomTableCell>
                    {n.status == 'COMPLETED' ? 
                    <img src="https://www.shareicon.net/data/512x512/2017/03/29/881755_checkmark_512x512.png"
                          width="20px" height="20px"/>: null}
                  </CustomTableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

CustomizedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CustomizedTable);