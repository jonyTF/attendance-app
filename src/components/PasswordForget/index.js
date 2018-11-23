import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, FormControl, TextField, Typography } from '@material-ui/core';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const PasswordForgetPage = () => (
    <div>
        <Typography variant="title">
            Reset Password
        </Typography>
        <PasswordForgetForm />
    </div>
);

const INITIAL_STATE = {
    email: '',
    error: null,
};

class PasswordForgetFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        this.props.firebase
            .doPasswordReset(this.state.email)
            .then(() => {
                this.setState({ success: 'An email has been sent to ' + this.state.email + ' with instructions to reset your password.'});
                this.setState({ ...INITIAL_STATE });
            })
            .catch(error => {
                this.setState({ success: '' });
                this.setState({ error });
            });

        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        return (
            <form onSubmit={this.onSubmit}>
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
                <Button 
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                >
                    Reset Password
                </Button>

                {this.state.success && <p style={{color: 'green'}}>{this.state.success}</p>}
                {this.state.error && <p style={{color: 'red'}}>{this.state.error.message}</p>}
            </form>
        );
    }
}

const PasswordForgetLink = () => (
    <p>
        <Link to={ROUTES.PASSWORD_FORGET}>Forgot password?</Link>
    </p>
);

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };