import React from 'react';
import { Typography } from '@material-ui/core';

import { AuthUserContext } from '../Session';
import { withAuthorization } from '../Session';
import PasswordChangeForm from '../PasswordChange';

const AccountPage = () => (
    <AuthUserContext.Consumer>
        { authUser => (
            <div>
                <Typography variant='title'>
                    Account: { authUser.email }
                </Typography>
                <PasswordChangeForm />
            </div>
        )}
    </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);