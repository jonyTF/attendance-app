import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import NavBar from '../NavBar';
import LandingPage from '../Landing';
import HomePage from '../Home';
import SignInPage from '../SignIn';
import SignUpPage from '../SignUp';
import AccountPage from '../Account';
import PasswordForgetPage from '../PasswordForget';
import NewPage from '../New';
import RoomsPage from '../Rooms';

import { withAuthentication } from '../Session';
import * as ROUTES from '../../constants/routes';
import { CssBaseline } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
  typography: {
    useNextVariants: true,
  },
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
    }
  }

  componentDidUpdate() {
    if (this.state.isLoading) {
      this.setState({ isLoading: false });
    }
  }

  render() {
    // TODO: Instead of displaying null, display a loading screen
    if (this.state.isLoading) {
      return null;
    }

    const { classes } = this.props;

    return (
      <Router>
        <div>
          <NavBar />
          <main className={classes.main}>
            <CssBaseline />
            <Route exact path={ROUTES.LANDING} component={LandingPage} />
            <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
            <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
            <Route exact path={ROUTES.HOME} component={HomePage} />
            <Route exact path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
            <Route exact path={ROUTES.ACCOUNT} component={AccountPage} />
            <Route exact path={ROUTES.NEW} component={NewPage} />
            <Route exact path={ROUTES.ROOMS} component={RoomsPage} />
          </main>
        </div>
      </Router>
    );
    }
}

export default withAuthentication(withStyles(styles)(App));
