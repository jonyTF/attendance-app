import { Avatar, Typography, Button, Paper, TextField, FormControl } from '@material-ui/core';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircleRounded';

import formStyles from '../../styles/formStyles';
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
    error: null
};

class SignInFormBase extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    onSubmit = event => {
        this.props.firebase
            .doSignInWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.HOME);
            })
            .catch(error => {
                this.setState({ error });
            });

        event.preventDefault();
    }

    render() {
        const { classes } = this.props;

        return (
            <Paper className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <AccountCircle />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Log in
                </Typography>
                <form className={classes.form} onSubmit={this.onSubmit}>
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
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        className={classes.submit}
                        fullWidth
                    >
                    Sign in
                    </Button>

                    <PasswordForgetLink />
                    
                    {this.state.error && <p style={{color:"red"}}>{this.state.error.message}</p>}
                </form>
            </Paper>
        );
    }
}

const SignInForm = compose(
    withRouter,
    withFirebase,
    withStyles(formStyles)
)(SignInFormBase);

const condition = authUser => !authUser;

export default withAuthorization(condition, false)(SignInPage);

export { SignInForm };