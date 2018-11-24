import React, { Component } from 'react';
import { Avatar, Typography, Button, Paper, TextField, FormControl } from '@material-ui/core';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircleRounded';

import formStyles from '../../styles/formStyles';
import { withAuthorization } from '../Session';
import { Link, withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const SignUpPage = () => (
    <div>
        <SignUpForm />
    </div>
);

const INITIAL_STATE = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    error: null
};

class SignUpFormBase extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    onSubmit = event => {
        this.props.firebase
            .doCreateUserWithEmailAndPassword(
                this.state.email, 
                this.state.password,
            )
            .then(authUser => {
                console.log('authUser: ', authUser);
                // Create user in Firebase database
                this.props.firebase
                    .user(authUser.user.uid)
                    .set({
                        email: this.state.email,
                        firstName: this.state.firstName,
                        lastName: this.state.lastName,
                    })
                    .then(() => {
                        this.setState({ ...INITIAL_STATE });
                        this.props.history.push(ROUTES.HOME);
                    })
                    .catch((error) => {
                        this.setState({ error });
                    });
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
                    Sign up
                </Typography>
                <form className={classes.form} onSubmit={this.onSubmit}>
                    <FormControl margin="normal" fullWidth>
                        <TextField
                            name="firstName"
                            value={this.state.firstName}
                            placeholder="Enter your first name"
                            label="First name"
                            onChange={this.onChange}
                            required
                        />
                    </FormControl>
                    <FormControl margin="normal" fullWidth>
                        <TextField
                            name="lastName"
                            value={this.state.lastName}
                            placeholder="Enter your last name"
                            label="Last name"
                            onChange={this.onChange}
                            required
                        />
                    </FormControl>
                    <FormControl margin="normal" fullWidth>
                        <TextField
                            name="email"
                            value={this.state.email}
                            placeholder="Enter your email address"
                            label="Email"
                            autoComplete="email"
                            onChange={this.onChange}
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
                            required
                        />
                    </FormControl>
                    <Button 
                        color="primary"
                        variant="contained"
                        type="submit"
                        className={classes.submit}
                        fullWidth
                    >
                    Sign Up
                    </Button>

                    {this.state.error && <p style={{color:"red"}}>{this.state.error.message}</p>}
                </form>
            </Paper>
        );
    }
}

const SignUpForm = compose(
    withRouter,
    withFirebase,
    withStyles(formStyles)
)(SignUpFormBase);

const SignUpLink = () => (
    <p>
        Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign up</Link>
    </p>
);

const condition = authUser => !authUser;

export default withAuthorization(condition, false)(SignUpPage);

export { SignUpForm, SignUpLink };