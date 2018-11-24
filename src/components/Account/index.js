import React, { Component } from 'react';
import { Paper, Typography } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import formStyles from '../../styles/formStyles';
import { withAuth, withAuthorization } from '../Session';
import PasswordChangeForm from '../PasswordChange';

const AccountPage = () => (
    <div>
        <h1>My Account</h1>
        <AccountInfo />
        <PasswordChangeForm />
    </div>
);

class AccountInfoBase extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            email: '',
        };

        this.user = this.props.firebase.user(this.props.authUser.uid);
    }

    componentDidMount() {
        this.user.on('value', (snapshot) => {
            const { email, firstName, lastName } = snapshot.val();
            this.setState({ 
                firstName, 
                lastName, 
                email
            });
        });
    }

    componentWillUnmount() {
        this.user.off();
    }

    render() {
        const { classes } = this.props;
        
        // TODO: display loading icon when it is loading the states
        return (
            <Paper className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Account Info
                </Typography>
                <div className={classes.form}>
                    <span><strong>Name:</strong> {this.state.firstName} {this.state.lastName}</span>
                    <br />
                    <span><strong>Email:</strong> {this.state.email}</span>
                </div>
            </Paper>
        );
        }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);

// TODO: Make it not formStyles in the future. Have a separate style file
const AccountInfo = compose(
    withAuth,
    withFirebase,
    withStyles(formStyles)
)(AccountInfoBase);

export { AccountInfo };