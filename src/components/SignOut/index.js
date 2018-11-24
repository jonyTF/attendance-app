import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';

import { withFirebase } from '../Firebase';

const SignOutItem = ({ firebase }) => (
    <MenuItem onClick={firebase.doSignOut}>
        Sign out
    </MenuItem>
);

export default withFirebase(SignOutItem);