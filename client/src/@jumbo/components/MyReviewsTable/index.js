import React, {useEffect, useState} from "react";
import GridContainer from "../../../@jumbo/components/GridContainer";
import PageContainer from "../../../@jumbo/components/PageComponents/layouts/PageContainer";
import IntlMessages from "../../../@jumbo/utils/IntlMessages";
import Grid from "@material-ui/core/Grid";
import SidebarButtons from "../../../@jumbo/components/AppLayout/partials/SideBar/SIdebarButtons";
import Divider from "@material-ui/core/Divider";
import PropTypes from "prop-types";
import {lighten, makeStyles} from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import axios from "axios";
import Timeago from "react-timeago";
import {TextRotationAngledownSharp} from "@material-ui/icons";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset"
    }
  }
});

function createData(item_name, by, date, url){
  return {
    item_name,
    by,
    date,
    url
  };
}

function Row(props){
  const {row} = props;
  const [ open, setOpen ] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <a href={"/item/" + row.url}>{row.item_name}</a>
        </TableCell>
        <TableCell align="right">{row.by}</TableCell>
        <TableCell align="right">
          <Timeago date={row.date} />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody />
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    item_name: PropTypes.string.isRequired,
    by: PropTypes.string.isRequired,
    date: PropTypes.number.isRequired
  }).isRequired
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: lighten(theme.palette.background.paper, 0.1)
  }
}));

const MyReviewsTable = () => {
  const classes = useStyles();
  const [ rows, setRows ] = useState([]);

  useEffect(() => {
    getRecentReviews();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getRecentReviews = () => {
    var url;
    if (process.env.NODE_ENV === "production")
      url = process.env.REACT_APP_PROD_URL+"/myreviews";
    else url = "http://localhost:3000/myreviews";
    axios.defaults.withCredentials = true;
    axios
      .post(url, {
        withCredentials: true
      })
      .then(response => {
        if (response.data) {
          console.log(response.data);
          var data_grid = [];
          response.data.map(item => {
            data_grid.push(
              createData(
                item.category.name.substring(
                  0,
                  item.category.name.indexOf("&")
                ),
                item.user.username,
                item.timestamp,
                item.category.name.substring(
                  item.category.name.indexOf(";") + 2
                )
              )
            );
          });
          setRows(data_grid);
        }
      });
  };

  return (
    <TableContainer component={Paper} className={classes.root}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Reviewed item</TableCell>
            <TableCell align="right">Reviewed by</TableCell>
            <TableCell align="right">Posted time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => <Row key={row.item_name} row={row} />)}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MyReviewsTable;
