import React from "react";
import {Redirect, Route, Switch} from "react-router";
import {useSelector} from "react-redux";
import {useLocation} from "react-router-dom";
import ReviewsPage from "./Pages/ReviewsPage";
import ItemPage from "./Pages/ItemPage";
import Error404 from "./Pages/404";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import ForgotPasswordPage from "./Auth/ForgotPassword";

const RestrictedRoute = ({component: Component, ...rest}) => {
  const {authUser} = useSelector(({auth}) => auth);
  return (
    <Route
      {...rest}
      render={props =>
        authUser ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/signin",
              state: {from: props.location}
            }}
          />
        )}
    />
  );
};

const Routes = () => {
  const {authUser} = useSelector(({auth}) => auth);
  const location = useLocation();

  if (location.pathname === "" || location.pathname === "/") {
    return <Redirect to={"/reviews"} />;
  } else if (authUser && location.pathname === "/signin") {
    return <Redirect to={"/reviews"} />;
  }

  return (
    <React.Fragment>
      <Switch>
        <Route path="/reviews" component={ReviewsPage} />
        <Route path="/signin" component={Login} />
        <Route path="/item/*" component={ItemPage} />
        <Route path="/signup" component={Register} />
        <Route path="/forgot-password" component={ForgotPasswordPage} />
        <Route component={Error404} />
      </Switch>
    </React.Fragment>
  );
};

export default Routes;
