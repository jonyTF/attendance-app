import React, { Component } from 'react';
import { FormControl, TextField } from '@material-ui/core';
import { compose } from 'recompose';

import PaperBase, { PaperFormBase } from '../PaperBase';
import { withAuth } from '../Session';
import { withFirebase } from '../Firebase';

const INITIAL_STATE = {
    password1: '',
    password2: '',
    error: null,
}

class PasswordChangeFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        event.preventDefault();

        const credential = this.props.firebase.doCreateCredential(  
            this.props.authUser.email,
            this.state.password1
        );

        this.props.firebase
            .doReauthenticateAndRetrieveDataWithCredential(credential)
            .then(() => {
                this.props.firebase
                    .doPasswordUpdate(this.state.password2)
                    .then(() => {
                        this.setState({ ...INITIAL_STATE });
                        this.setState({ success: 'Password changed successfully.' });
                    })
                    .catch(error => {
                        this.setState({ error });
                        this.setState({ success: '' });
                    });
            })
            .catch(error => {
                this.setState({ error });
                this.setState({ success: '' });
            });    
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        return (
            <PaperBase title="Change Password">
                <PaperFormBase onSubmit={this.onSubmit} submitBtnText="Change Password">
                    <FormControl margin="normal" fullWidth>
                        <TextField 
                            name="password1"
                            value={this.state.password1}
                            type="password"
                            placeholder="Enter your current password"
                            label="Current password"
                            onChange={this.onChange}
                            autoComplete="current-password"
                            required
                        />
                    </FormControl>
                    <FormControl margin="normal" fullWidth>
                        <TextField 
                            name="password2"
                            value={this.state.password2}
                            type="password"
                            placeholder="Enter your new password"
                            label="New password"
                            onChange={this.onChange}
                            required
                        />
                    </FormControl>
                </PaperFormBase>

                {this.state.success && <p style={{color: 'green'}}>{this.state.success}</p>}
                {this.state.error && <p style={{color: 'red'}}>{this.state.error.message}</p>}
            </PaperBase>
        );
    }
}

const PasswordChangeForm = compose(
    withAuth,
    withFirebase,
)(PasswordChangeFormBase);

export default PasswordChangeForm;