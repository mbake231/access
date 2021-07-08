import React from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import {useSpring, animated} from "react-spring/web.cjs"; // web.cjs is required for IE 11 support
import TextField from "@material-ui/core/TextField";
import ReactStars from "react-rating-stars-component";
import Button from "@material-ui/core/Button";
import axios from "axios";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%"
  },
  formControl: {
    margin: theme.spacing(2),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(4)
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4, 8, 6),
    width: "500px"
  },
  button: {
    "& > *": {
      margin: theme.spacing(2)
    }
  }
}));

const Fade = React.forwardRef(function Fade(props, ref){
  const {in: open, children, onEnter, onExited, ...other} = props;
  const style = useSpring({
    from: {opacity: 0},
    to: {opacity: open ? 1 : 0},
    onStart: () => {
      if (open && onEnter) {
        onEnter();
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited();
      }
    }
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {children}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element,
  in: PropTypes.bool.isRequired,
  onEnter: PropTypes.func,
  onExited: PropTypes.func
};

const ReviewCreator = props => {
  const classes = useStyles();
  const [ food_score, setFoodScore ] = React.useState();
  const [ service_score, setServiceScore ] = React.useState();
  const [ room_score, setRoomScore ] = React.useState();
  const [ overall_score, setOverallScore ] = React.useState();
  const [ reviewBody, setReviewBody ] = React.useState();
  const [ reviewTitle, setReviewTitle ] = React.useState();
  const [ review_type, setReviewType ] = React.useState("");

  const handleBodyChange = event => {
    setReviewBody(event.target.value);
  };

  const handleTitleChange = event => {
    setReviewTitle(event.target.value);
  };
  const submitReview = () => {
    var url;
    if (process.env.NODE_ENV === "production")
      url = "https://www.thelocalgame.com/login";
    else url = "http://localhost:3000/submitReview";
    axios.defaults.withCredentials = true;

    axios
      .post(
        url,
        {
          room_score: room_score,
          service_score: service_score,
          overall_score: overall_score,
          food_score: food_score,
          review_title: reviewTitle,
          review_body: reviewBody,
          item_id: props.item_id,
          review_type: review_type,
          cid: props.review_cid
        },
        {
          withCredentials: true
        }
      )
      .then(response => {
        if (response) {
          console.log(response);
          // window.location.reload();
        }
      });
  };

  const handleOpen = () => {
    props.setOpen(true);
  };

  const handleTypeChange = event => {
    setReviewType(event.target.value);
  };

  const handleClose = () => {
    props.setOpen(false);
  };

  return (
    <div>
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        className={classes.modal}
        open={props.open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={props.open}>
          <div className={classes.paper}>
            <h2 id="spring-modal-title">Create a review</h2>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-label">Review Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={review_type}
                onChange={handleTypeChange}
              >
                <MenuItem value={"client"}>Client Review</MenuItem>
                <MenuItem value={"advisor"}>Advisor Review</MenuItem>
              </Select>
            </FormControl>
            <br />
            <br />
            <div style={{float: "left", width: "50%"}}>
              Food Score:{" "}
              <ReactStars
                count={5}
                onChange={setFoodScore}
                size={24}
                activeColor="#ffd700"
              />
            </div>
            Room Score:<ReactStars
              count={5}
              onChange={setRoomScore}
              size={24}
              activeColor="#ffd700"
              style={{width: "40%"}}
            />
            <div style={{float: "left", width: "50%"}}>
              Service Score:{" "}
              <ReactStars
                count={5}
                onChange={setServiceScore}
                size={24}
                activeColor="#ffd700"
              />
            </div>
            Overall Score:{" "}
            <ReactStars
              count={5}
              onChange={setOverallScore}
              size={24}
              activeColor="#ffd700"
            />
            <br />
            <p id="spring-modal-description" />
            <TextField
              id="outlined-multiline-static"
              label="Review Title"
              multiline
              rows={1}
              defaultValue=""
              variant="outlined"
              onChange={handleTitleChange}
              style={{width: "100%"}}
            />
            <br />
            <br />
            <TextField
              id="outlined-multiline-static"
              label="Review Body"
              multiline
              rows={10}
              onChange={handleBodyChange}
              defaultValue=""
              variant="outlined"
              style={{width: "100%"}}
            />
            <br />
            <br />
            <Button
              class={classes.button}
              variant="contained"
              color="primary"
              onClick={submitReview}
            >
              Submit Review
            </Button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};
export default ReviewCreator;
