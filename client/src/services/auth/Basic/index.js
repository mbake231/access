import {fetchError, fetchStart, fetchSuccess} from "../../../redux/actions";
import {
  setAuthUser,
  setForgetPassMailSent,
  updateLoadUser
} from "../../../redux/actions/Auth";
import React from "react";
import axios from "axios";

const BasicAuth = {
  onRegister: ({name, email, password}) => {
    return dispatch => {
      dispatch(fetchStart());

      setTimeout(() => {
        dispatch(fetchSuccess());
        const user = {name: name, email: email, password: password};
        localStorage.setItem("user", JSON.stringify(user));
        dispatch(setAuthUser(user));
      }, 300);
    };
  },

  onLogin: ({email, password}) => {
    return dispatch => {
      try {
        dispatch(fetchStart());

        var url;
        if (process.env.NODE_ENV === "production")
          url = process.env.REACT_APP_PROD_URL+"/login";
        else url = "http://localhost:3000/login";

        axios
          .post(
            url,
            {
              email: email,
              password: password
            },
            {
              withCredentials: true
            }
          )
          .then(response => {
            if (response) {
              console.log(response);
              document.cookie = `nodebb=${response.data}`;
              const user = {
                name: "Adminfart",
                email: email,
                password: password
              };
              dispatch(fetchSuccess());
              localStorage.setItem("user", JSON.stringify(user));
              dispatch(setAuthUser(user));
            } else {
              console.log("hi");
              dispatch(updateLoadUser(true));
            }
          });
      } catch (error) {
        dispatch(fetchError(error.message));
      }
    };
  },
  onLogout: () => {
    return dispatch => {
      dispatch(fetchStart());

      setTimeout(() => {
        dispatch(fetchSuccess());
        localStorage.removeItem("user");
        dispatch(setAuthUser(null));
      }, 300);
    };
  },

  getAuthUser: (loaded = false) => {
    return dispatch => {
      dispatch(fetchStart());
      dispatch(updateLoadUser(loaded));

      var userurl;
      if (process.env.NODE_ENV === "production")
        userurl = process.env.REACT_APP_PROD_URL+"/user";
      else userurl = "http://localhost:3000/user";
      axios.defaults.withCredentials = true;
   
      axios
        .post(userurl, {
          withCredentials: true
        })
        .then(response => {
          console.log(response);
          if (response.data) {
           
            
            dispatch(setAuthUser(JSON.parse(localStorage.getItem("user"))));
            dispatch(fetchSuccess());
          } 
          else {
            console.log('failed')
            localStorage.removeItem("user");
            dispatch(setAuthUser(null));
            //dispatch(updateLoadUser(true));
          }
        }).catch((error)=> {
        //  dispatch(fetchSuccess());
          
          console.log(error)
          dispatch(updateLoadUser(true));
        })
        
        
      
    };
  },

  onForgotPassword: () => {
    return dispatch => {
      dispatch(fetchStart());

      setTimeout(() => {
        dispatch(setForgetPassMailSent(true));
        dispatch(fetchSuccess());
      }, 300);
    };
  },
  getSocialMediaIcons: () => {
    return <React.Fragment> </React.Fragment>;
  }
};

export default BasicAuth;
