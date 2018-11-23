import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

class AdminPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            users: [],
        };
    }
    
    componentDidMount() {
        this.setState({ loading: true });

        this.props.firebase.users().on('value', snapshot => {
            const usersObject = snapshot.val();

            const usersList = Object.keys(usersObject).map(key => ({
                ...usersObject[key],
                uid: key,
            }));

            this.setState({
                users: usersList,
                loading: false,
            });
        });
    }

    componentWillUnMount() {
        this.props.firebase.users().off();
    }

    render() {
        return (
            <div>
                <h1>Admin</h1>

                {this.state.loading && <div>Loading...</div>}
                
                <UserList users={this.state.users}/>
            </div>
        );
    }
}

const UserList = ({ users }) => (
    <ul>
        {
            users.map(user => (
                <li key={user.uid}>
                    <span>
                        <strong>ID:</strong> {user.uid}
                    </span>
                    <span>
                        <strong>Name:</strong> {user.firstName} {user.lastName}
                    </span>
                </li>
            ))
        }
    </ul>
);

export default withFirebase(AdminPage);