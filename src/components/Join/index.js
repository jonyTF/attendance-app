import React, { Component } from 'react';
import { FormControl, TextField } from '@material-ui/core';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import PaperBase, { PaperFormBase } from '../PaperBase';
import { withFirebase } from '../Firebase';
import { withAuth, withAuthorization } from '../Session';
import * as ROUTES from '../../constants/routes';

const JoinPage = () => (
    <div>
        <h1>Join</h1>
        <JoinForm />
    </div>
);

const INITIAL_STATE = {
    code: '',
    error: '',
};

class JoinFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    onSubmit = event => {
        const { code } = this.state;

        // TODO(Urgent): Make it so you can't join your own room
        this.props.firebase.globalRooms().once('value', snapshot => {
            if (snapshot.child(code).exists()) {
                this.props.firebase
                    .userRooms(this.props.authUser.uid)
                    .push({
                        code,
                        owner: false,
                    })
                    .then(() => {
                        this.setState({ ...INITIAL_STATE });
                        this.setState({ success: 'Successfully joined room.' });
                        this.props.history.push(ROUTES.ROOMS);
                    })
                    .catch((error) => {
                        this.setState({ success: '' });
                        this.setState({ error });
                    });
            } else {
                this.setState({ error: { message: 'The room you entered does not exist.' } });
            }
        })

        event.preventDefault();
    };
    
    render() {
        // TODO: Have a limit as to how many rooms one can create
        return (
            <PaperBase title="Join Room">
                <PaperFormBase onSubmit={this.onSubmit} submitBtnText="Join">
                    <FormControl margin="normal" fullWidth>
                        <TextField 
                            name="code"
                            value={this.state.code}
                            placeholder="Enter a room code"
                            label="Room code"
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

const JoinForm = compose(
    withRouter,
    withAuth,
    withFirebase,
)(JoinFormBase);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(JoinPage);

export { JoinForm };