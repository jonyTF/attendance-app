import React, { Component } from 'react';
import { compose } from 'recompose';

import PaperBase from '../PaperBase';
import { withFirebase } from '../Firebase';
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
        
        // TODO: display loading icon when it is loading the states
        return (
            <PaperBase title="Account Info">
                <span><strong>Name:</strong> {this.state.firstName} {this.state.lastName}</span>
                <br />
                <span><strong>Email:</strong> {this.state.email}</span>
            </PaperBase>
        );
        }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);

const AccountInfo = compose(
    withAuth,
    withFirebase,
)(AccountInfoBase);

export { AccountInfo };