import React from 'react';
import Button from '@material-ui/core/Button';

import { withFirebase } from '../Firebase';

const SignOutButton = ({ firebase }) => (
    <Button variant="contained" color="secondary" onClick={firebase.doSignOut}>
        Sign out
    </Button>
);

export default withFirebase(SignOutButton);