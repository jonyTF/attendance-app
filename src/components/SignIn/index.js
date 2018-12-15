import React, { Component } from 'react';
import { Checkbox, Divider, TextField, FormControl, FormControlLabel } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import { BrowserView, isMobile } from 'react-device-detect';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import AccountCircle from '@material-ui/icons/AccountCircle';
import GoogleButton from 'react-google-button';

import PaperBase, { PaperFormBase } from '../PaperBase';
import { withAuthorization } from '../Session';
import { PasswordForgetLink } from '../PasswordForget';
import { SignUpLink } from '../SignUp';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const SignInPage = () => (
    <div>
        <SignInForm />
        <SignUpLink />
    </div>
);

const INITIAL_STATE = {
    email: '',
    password: '',
    remember: isMobile,
    error: null
};

class SignInFormBase extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };

        this.props.firebase
            .doGetRedirectResult()
            .then(result => {
                const user = result.user;

                console.log('user: ', user);

                if (user) {
                    this.handleGoogleSignIn(user);
                }
            })
            .catch(error => {
                this.setState({ error });
            });
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    onCheck = event => {
        this.setState({ remember: event.target.checked });
    };

    onSubmit = event => {
        this.props.firebase
            .doSetPersistence(this.state.remember)
            .then(() => {
                this.props.firebase
                    .doSignInWithEmailAndPassword(this.state.email, this.state.password)
                    .then(() => {
                        this.setState({ ...INITIAL_STATE });
                        this.props.history.push(ROUTES.HOME);
                    })
                    .catch(error => {
                        this.setState({ error });
                    });
            })
            .catch(error => {
                this.setState({ error });
            });

        event.preventDefault();
    };

    onGoogleClick = () => {
        if (isMobile) {
            this.props.firebase
                .doSignInWithGoogle()
                .catch(error => {
                    this.setState({ error });
                });
        } else {
            this.props.firebase
                .doSignInWithGoogle()
                .then(result => {
                    const user = result.user;

                    this.handleGoogleSignIn(user);
                })
                .catch(error => {
                    this.setState({ error });
                });
        }
    };

    handleGoogleSignIn = (user) => {
        this.props.firebase
            .user(user.uid)
            .once('value', snapshot => {
                if (!snapshot.exists()) {
                    this.props.firebase
                        .user(user.uid)
                        .set({
                            email: user.email,
                            name: user.displayName
                        })
                        .then(() => {
                            this.props.history.push(ROUTES.HOME);
                        })
                        .catch(error => {
                            this.setState({ error });
                        });
                }
            })
    };

    render() {
        const { classes } = this.props;
        //https://developers.google.com/identity/toolkit/images/federated_login_nascar.png 
        return (
            <PaperBase iconComponent={AccountCircle} title="Sign in">
                <GoogleButton
                    type="dark"
                    onClick={this.onGoogleClick}
                    className={classes.google}
                />
                <Divider className={classes.divider} />

                <PaperFormBase onSubmit={this.onSubmit} submitBtnText="Sign in">
                    <FormControl margin="normal" fullWidth>
                        <TextField
                            name="email"
                            value={this.state.email}
                            placeholder="Enter your email address"
                            label="Email"
                            onChange={this.onChange}
                            autoComplete="email"
                            required
                        />
                    </FormControl>
                    <FormControl margin="normal" fullWidth>
                        <TextField
                            name="password"
                            value={this.state.password}
                            type="password"
                            placeholder="Enter your password"
                            label="Password"
                            onChange={this.onChange}
                            autoComplete="current-password"
                            required
                        />
                    </FormControl>
                    <BrowserView>
                        <FormControlLabel
                            control={
                                <Checkbox checked={this.state.remember} onChange={this.onCheck} value="remember" />
                            }
                            label="Remember password"
                        />
                    </BrowserView>
                </PaperFormBase>
                
                <PasswordForgetLink />
                {this.state.error && <p style={{color: 'red'}}>{this.state.error.message}</p>}
            </PaperBase>
        );
    }
}

const styles = theme => ({
    google: {
        margin: 'auto',
    },
    divider: {
        marginTop: theme.spacing.unit*3,
    }
});

const SignInForm = compose(
    withRouter,
    withFirebase,
    withStyles(styles),
)(SignInFormBase);

const condition = authUser => !authUser;

export default withAuthorization(condition, false)(SignInPage);

export { SignInForm };