import React from 'react';

import { withAuthorization } from '../Session';
import { CreateForm } from '../Create';
import { JoinForm } from '../Join';


const NewPage = () => (
    <div>
        <CreateForm />
        <JoinForm />
    </div>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(NewPage);