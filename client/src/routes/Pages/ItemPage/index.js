import React, {useEffect, useState} from "react";
import GridContainer from "../../../@jumbo/components/GridContainer";
import PageContainer from "../../../@jumbo/components/PageComponents/layouts/PageContainer";
import IntlMessages from "../../../@jumbo/utils/IntlMessages";
import Grid from "@material-ui/core/Grid";
import SidebarButtons from "../../../@jumbo/components/AppLayout/partials/SideBar/SIdebarButtons";
import Divider from "@material-ui/core/Divider";
import {getDateinDesiredFormat} from "@jumbo/utils/dateHelper";
import axios from "axios";
import {Box, fade, Typography} from "@material-ui/core";
import {JumboCard} from "@jumbo/components/Common";
import CmtMediaObject from "@coremat/CmtMediaObject";
import CmtList from "@coremat/CmtList";
import ListEmptyResult from "@coremat/CmtList/ListEmptyResult";
import {makeStyles, withStyles} from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Chip from "@material-ui/core/Chip";
import {SET_TASKS_DATA} from "@jumbo/constants/ActionTypes";
import ReviewCreator from "@jumbo/components/ReviewCreator";
import CmtButtons from "@coremat/CmtButtons";

const AntTabs = withStyles({
  root: {
    borderBottom: "1px solid #e8e8e8"
  },
  indicator: {
    backgroundColor: "#1890ff"
  }
})(Tabs);

const AntTab = withStyles(theme => ({
  root: {
    textTransform: "none",
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(8),
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(","),
    "&:hover": {
      color: "#40a9ff",
      opacity: 1
    },
    "&$selected": {
      color: "#1890ff",
      fontWeight: theme.typography.fontWeightMedium
    },
    "&:focus": {
      color: "#40a9ff"
    }
  },
  selected: {}
}))(props => <Tab disableRipple {...props} />);

const StyledTabs = withStyles({
  indicator: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    "& > span": {
      maxWidth: 40,
      width: "100%",
      backgroundColor: "#635ee7"
    }
  }
})(props => <Tabs {...props} TabIndicatorProps={{children: <span />}} />);

const StyledTab = withStyles(theme => ({
  root: {
    textTransform: "none",
    color: "#fff",
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(2),
    "&:focus": {
      opacity: 1
    }
  }
}))(props => <Tab disableRipple {...props} />);

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    paddingLeft: 16,
    paddingRight: 16,
    minHeight: 64,
    [theme.breakpoints.up("md")]: {
      minHeight: 72
    },
    [theme.breakpoints.up("md")]: {
      paddingLeft: 24,
      paddingRight: 24
    }
  },
  headerBox: {
    backgroundImage: "url(/images/profile-bg-img.png)",
    height: "40%",
    color: "white",
    fontSize: "30pt"
  },
  h1: {
    paddingLeft: "1%",
    paddingTop: "5%",
    color: "white",
    fontSize: "30pt"
  },
  h2: {
    paddingLeft: "1%",
    color: "white",
    fontSize: "20pt"
  },
  searchRoot: {
    position: "relative",
    width: 260,
    [theme.breakpoints.up("md")]: {
      width: 350
    },
    "& .MuiSvgIcon-root": {
      position: "absolute",
      left: 18,
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 1
    },
    "& .MuiInputBase-root": {
      width: "100%"
    },
    "& .MuiInputBase-input": {
      height: 48,
      borderRadius: 30,
      backgroundColor: fade(theme.palette.common.dark, 0.38),
      color: fade(theme.palette.common.white, 0.7),
      boxSizing: "border-box",
      padding: "5px 15px 5px 50px",
      transition: "all 0.3s ease",
      "&:focus": {
        backgroundColor: fade(theme.palette.common.dark, 0.58),
        color: fade(theme.palette.common.white, 0.7)
      }
    }
  },
  langRoot: {
    borderLeft: `solid 1px ${fade(theme.palette.common.dark, 0.15)}`,
    minHeight: 72,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 8,
    paddingRight: 8,
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      minHeight: 64
    }
  },
  iconBtn: {
    color: fade(theme.palette.common.white, 0.38),
    "&:hover, &:focus": {
      color: theme.palette.common.white
    }
  },
  padding: {
    padding: theme.spacing(6)
  },
  demo1: {
    backgroundColor: theme.palette.background.paper
  },
  demo2: {
    backgroundColor: "#2e1534"
  }
}));

const breadcrumbs = [
  {label: <IntlMessages id={"sidebar.main"} />, link: "/"},
  {label: <IntlMessages id={"pages.samplePage"} />, isActive: true}
];

const ItemPage = () => {
  const [ value, setValue ] = React.useState(0);

  const handleChange = (event, newValue) => {
    console.log(newValue);
    setValue(newValue);
  };
  const classes = useStyles();
  const [ reviews, setReviews ] = useState([]);
  const [ itemData, setItemData ] = useState([]);
  const item_id = window.location.href.substr(
    window.location.href.lastIndexOf("/") + 1
  );
  const [ open, setOpen ] = React.useState(false);

  const buttons = [
    {
      label: "Add review",
      color: "primary",
      tooltip: "Add review"
    }
  ];

  useEffect(() => {
    getItemData();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getItemData = () => {
    var userurl;
    if (process.env.NODE_ENV === "production")
      userurl = "https://www.thelocalgame.com/user";
    else userurl = "http://localhost:3000/item";
    axios.defaults.withCredentials = true;
    axios
      .post(
        userurl,
        {item_id: item_id},
        {
          withCredentials: true
        }
      )
      .then(response => {
        if (response) {
          console.log(response);
          setReviews(response.data.reviews);
          setItemData(response.data);
        } else {
          console.log("oy");
        }
      });
  };
  const addReviewClick = () => {};

  const renderRow = (item, index) => {
    var filter = [];
    if (value == 1) {
      filter.push("advisor");
    } else if (value == 2) {
      filter.push("client");
    } else {
      filter.push("advisor");
      filter.push("client");
    }

    if (filter.includes(item.scores.review_type))
      return (
        <Box mb={2} key={index} className={classes.itemRoot}>
          <JumboCard>
            <Chip
              label={
                item.scores.review_type == "client" ? (
                  "Client review"
                ) : (
                  "Advisor Review"
                )
              }
              color={
                item.scores.review_type == "client" ? "secondary" : "primary"
              }
            />
            <CmtMediaObject
              avatar={item.profile_pic}
              title={item.review_title}
              titleProps={{className: classes.titleRoot}}
            >
              <Typography className={classes.descText} variant="body2">
                {item.scores.review_body}
                <br />
                Food score:{item.scores.food_score}
                <br />
                Room score: {item.scores.room_score}
                <br />
                Service score:{item.scores.service_score}
              </Typography>
            </CmtMediaObject>
          </JumboCard>
        </Box>
      );
  };

  return (
    <PageContainer>
      <ReviewCreator
        open={open}
        setOpen={setOpen}
        item_id={item_id}
        review_cid={itemData.review_cid}
      />
      <GridContainer>
        <Grid item xs={12}>
          <Box className={classes.headerBox}>
            <div className={classes.h1}>{itemData.name}</div>
            <div className={classes.h2}>{itemData.address}</div>
          </Box>
          <Divider />
          <Box>
            <Box className={classes.demo1}>
              <AntTabs
                value={value}
                onChange={handleChange}
                aria-label="ant example"
              >
                <AntTab label="All" />
                <AntTab label="Advisor Reviews" />
                <AntTab label="Client Reviews" />

                <CmtButtons
                  items={buttons}
                  variant="contained"
                  size="medium"
                  color={"primary"}
                  type="default"
                  onItemClick={() => setOpen(true)}
                  style={{float: "right", marginLeft: "42%"}}
                />
              </AntTabs>
            </Box>
            <Box>
              <CmtList
                data={reviews}
                renderRow={renderRow}
                onEndReached={() => console.log("You have reached end of list")}
                ListEmptyComponent={
                  <ListEmptyResult
                    loader={false}
                    title="No Reviews Yet"
                    actionTitle="Add a review"
                    onClick={() => setOpen(true)}
                  />
                }
              />
            </Box>
          </Box>
        </Grid>
      </GridContainer>
    </PageContainer>
  );
};

export default ItemPage;
