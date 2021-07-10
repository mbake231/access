import React, {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";
import SidebarToggleHandler from "../../../../../@coremat/CmtLayouts/Vertical/SidebarToggleHandler";
import Toolbar from "@material-ui/core/Toolbar";
import {Box, fade, InputBase} from "@material-ui/core";
import LanguageSwitcher from "../LanguageSwitcher";
import makeStyles from "@material-ui/core/styles/makeStyles";
import SearchIcon from "@material-ui/icons/Search";
import AppsMenu from "./AppsMenu";
import HeaderNotifications from "./HeaderNotifications";
import HeaderMessages from "./HeaderMessages";
import Hidden from "@material-ui/core/Hidden";
import Logo from "../Logo";
import SearchPopover from "../SearchPopover";
import TextField from "@material-ui/core/TextField";
import SearchBar from "material-ui-search-bar";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import CmtButtons from "@coremat/CmtButtons";
import ReviewCreator from "@jumbo/components/ReviewCreator";


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
  btnGroup: {
    display: "flex",
    paddingLeft: "10px",
    "& > *": {
      margin: theme.spacing(2)
    }
  }
}));

const buttons = [
  {
    label: "Add review",
    color: "green",
    tooltip: "Add review"
  }
];

const Header = () => {
  
  const classes = useStyles();
  const history = useHistory();
  const [ open, setOpen ] = React.useState(false);

  var autocomplete;
  useEffect(() => {
    handleScriptLoad();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const handleScriptLoad = () => {
    // Declare Options For Autocomplete
    const options = {};

    // Initialize Google Autocomplete
    /*global google*/
    autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("autocomplete"),
      options
    );
    console.log(autocomplete);
    // Avoid paying for data that you don't need by restricting the
    // set of place fields that are returned to just the address
    // components and formatted address
    autocomplete.setFields([ "place_id" ]);
    // Fire Event when a suggested name is selected
    autocomplete.addListener("place_changed", handlePlaceSelect);
  };
  const handlePlaceSelect = () => {
    // Extract City From Address Object
    const addressObject = autocomplete.getPlace();
    const pid = addressObject.place_id;
    // Check if pid is valid
    if (pid) {
      // Set State
      history.push("/item/" + pid);
    }
  };

  return (
    
    <Toolbar className={classes.root}>
      <ReviewCreator open={open}
        setOpen={setOpen}
        ></ReviewCreator>
      <Logo ml={2} color="white" />
      <Box className={classes.btnGroup} style={{color:'white'}}>
       
          <Button style={{color:'white',float:'left'}}>My Reviews</Button>
          <Button style={{paddingLeft: "15px",color:'white'}} href={"/forum"}>
            Forum
          </Button>
        
      </Box>
      <Box flex={1} />

      <SearchBar
        id="autocomplete"
        placeholder="Search & review..."
        style={{height: "40px",width:'500px', color: "black"}}
      />

        <CmtButtons
                  items={buttons}
                  variant="contained"
                  size="medium"
                  color={"primary"}
                  type="default"
                  onClick={() => setOpen(true)}
                  style={{float: "right", marginLeft: "42%"}}
                />    
    </Toolbar>
  );
};

export default Header;
