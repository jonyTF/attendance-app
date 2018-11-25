import React, { Component } from 'react';
import { FormControl, TextField } from '@material-ui/core';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import PaperBase, { PaperFormBase } from '../PaperBase';
import { withFirebase } from '../Firebase';
import { withAuth, withAuthorization } from '../Session';
import * as ROUTES from '../../constants/routes';

const CreatePage = () => (
    <div>
        <h1>Create</h1>
        <CreateForm />
    </div>
);

const INITIAL_STATE = {
    name: '',
    description: '',
    error: '',
};

class CreateFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    generateCode = len => {
        const randomNum = () => {
            return Math.trunc(Math.random() * 10);
        };

        const randomLet = () => {
            let rand = Math.random()*52;
            return String.fromCharCode(rand < 26 ? (rand + 65) : (rand-26 + 97));
        };

        let code = '';
        for (let i = 0; i < len; i++) {
            if (Math.random() < .5) {
                code += randomNum();
            } else {
                code += randomLet();
            }
        }
        return code;
    }

    onSubmit = event => {
        const { name, description } = this.state;
        const code = this.generateCode(6);

        // TODO(Urgent): Make sure class code is not the same as someone else's
        this.props.firebase
            .userRooms(this.props.authUser.uid)
            .push({
                code,
                owner: true,
            })
            .then(() => {
                this.props.firebase.globalRoom(code)
                    .set({
                        name,
                        description,
                    })
                    .then(() => {
                        this.setState({ ...INITIAL_STATE });
                        this.setState({ success: 'Successfully created room.' });
                        this.props.history.push(ROUTES.ROOMS);
                    })
                    .catch(error => {
                        this.setState({ success: '' });
                        this.setState({ error });
                    });
            })
            .catch((error) => {
                this.setState({ success: '' });
                this.setState({ error });
            });

        event.preventDefault();
    };
    
    render() {
        // TODO: Have a limit as to how many rooms one can create
        return (
            <PaperBase title="Create Room">
                <PaperFormBase onSubmit={this.onSubmit} submitBtnText="Create">
                    <FormControl margin="normal" fullWidth>
                        <TextField 
                            name="name"
                            value={this.state.name}
                            placeholder="Enter a name"
                            label="Room name"
                            onChange={this.onChange}
                            required
                        />
                    </FormControl>
                    <FormControl margin="normal" fullWidth>
                        <TextField 
                            name="description"
                            value={this.state.description}
                            placeholder="Enter a description (optional)"
                            label="Description"
                            onChange={this.onChange}
                        />
                    </FormControl>
                </PaperFormBase>

                {this.state.success && <p style={{color: 'green'}}>{this.state.success}</p>}
                {this.state.error && <p style={{color: 'red'}}>{this.state.error.message}</p>}
            </PaperBase>
        );
    }
}

const CreateForm = compose(
    withRouter,
    withAuth,
    withFirebase,
)(CreateFormBase);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(CreatePage);

export { CreateForm };