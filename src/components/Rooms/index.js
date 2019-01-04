import React, { Component } from 'react';
import { compose } from 'recompose';
import { Collapse, List, ListItem, ListItemText } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

import { withAuth, withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';

const RoomsPage = () => (
    <div>
        <h1>My Rooms</h1>
        <RoomsList />
    </div>
);

const styles = theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    }
});

class RoomsListBase extends Component {
    constructor(props) {
        super(props);
        
        this.userRoomsRef = props.firebase.userRooms(props.authUser.uid);

        this.state = {
            ownedRooms: [],
            rooms: [],
            openState: [],
        }
    }

    componentDidMount() {
        // TODO: Change this so that all the members are rendered in a separate component
        this.userRoomsRef.on('value', snapshot => {
            let userRooms = snapshot.val();

            let ownedRooms = [];
            let rooms = [];
            let openState = [];
            let id = 0;

            for (let roomCode in userRooms) {
                let list = userRooms[roomCode].owner ? ownedRooms : rooms;
                list.push({
                    code: roomCode, 
                    id: id
                });

                openState.push(false);
                id++;
            }
            this.setState({ ownedRooms, rooms, openState });
        });

        // TODO: Make this apply universally to the whole app (e.g. put it in the App index.js)
        this.props.firebase.messaging.onTokenRefresh(() => {
            this.props.firebase.messaging
                .getToken()
                .then(token => {
                    this.updateToken(token);
                });
            console.log('Token was refreshed!');
        });

        this.props.firebase
            .doRequestNotificationPermission()
            .then(() => {
                console.log('aGot notification permission!');
                return this.props.firebase.messaging.getToken();
            })
            .then((token) => {
                console.log(token);
                this.updateToken(token);
            })
            .catch(error => {
                console.log(error);
                this.updateToken(null);
            });

        this.props.firebase.messaging.onMessage(payload => {
            console.log('onMessage: ', payload);
        });

        /*
        curl -X POST -H "Authorization: key=AAAAZO0uiwg:APA91bHaIR-gx_tnCbTEITYTXBufw0AWStRr7FrpcvO8BmKGIU2LO0S3F5yrV55Im7r2xpe4Ii6cVPxitImjOS-ewGJd0esbYnh5lQ1q4bVLi666z5_mlIMkHIfik6LGz3IDB6cxo6Ga" -H "Content-Type: application/json" -d '{
            "notification": {
                "title": "FCM Message",
                "body": "This is an FCM Message",
            },
            "to": "d_iRcsmMs90:APA91bHw2rp9hkc8Q0LFjCriB10cuMc8LIxAc2fZmGHzlbRm3AQH_ucBOXBSJenN6DXEHmtnbHqemUIxTO9Sm3XxHoaGmb_8xmhJyG3INl7f-w29zPZ5qybXzyfu-ePbQMYg5HljBqGl"
        }' https://fcm.googleapis.com/fcm/send
        */
    }

    updateToken(token) {
        this.props.firebase
            .user(this.props.authUser.uid)
            .child('token')
            .set(token);
    }

    componentWillUnmount() {
        this.userRoomsRef.off();
    }
    
    onClick = (event, id) => {
        const openState = this.state.openState.map((state, index) => {
            if (index === id) {
                return !state;
            }
            return state;
        });
        this.setState({ openState });
    };

    takeAttendance = () => {
        fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
                'Authorization': 'key='+process.env.REACT_APP_SERVER_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                notification: {
                    title: 'Test',
                    body: 'This is a test',
                },
                to: 'cf0YpKnB94o:APA91bHIi24kDExmj8ZkU9u1f_eF1LFBGIL1ozBj3_5f5oMXZdeBtG-zTwEQ8try1Pbe9tvWyW8yOlybjFSrVE85dZP6MBvO2Z1-ngByt7a1Dhmo6Asv0eE2u6cqTOSdSwZCNqaXLqxC'
            })
        });
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <h2>Rooms I own</h2>
                {this.state.ownedRooms.length > 0
                    ? <RoomsListComponent 
                        isOwner={true} 
                        takeAttendance={this.takeAttendance} 
                        openState={this.state.openState} 
                        rooms={this.state.ownedRooms} 
                        onClick={this.onClick} 
                        classes={classes} 
                        firebase={this.props.firebase} 
                    />
                    : <div>You have not created any rooms!</div>
                }
                <h2>Rooms I am in</h2>
                {this.state.rooms.length > 0
                    ? <RoomsListComponent 
                        isOwner={false} 
                        openState={this.state.openState} 
                        rooms={this.state.rooms}
                        onClick={this.onClick}
                        classes={classes} 
                        firebase={this.props.firebase}
                    />
                    : <div>You have not joined any rooms!</div>
                }
            </div>
        );
    }
}

// TODO: Have options for each group (delete, display code in big dialog box, etc.)
// TODO: Make it so you can change room settings (change name, remove members, delete room, unjoin room, etc.)
class RoomsListComponent extends Component {

    render() {
        const { classes, rooms, onClick, openState, isOwner, takeAttendance } = this.props;
        return (
            <List className={classes.root}>
                {rooms.map((room) => (
                    <div key={room.id}>
                        <RoomListItem 
                            onClick={onClick} 
                            room={room} 
                            openState={openState} 
                            isOwner={isOwner} 
                            takeAttendance={takeAttendance} 
                            firebase={this.props.firebase}
                        />
                    </div>
                ))}
            </List>
        );
    }
}

class RoomListItem extends Component {
    constructor(props) {
        super(props);

        this.roomRef = this.props.firebase.globalRoom(this.props.room.code);

        this.state = {
            roomData: {},
        };
    }

    componentDidMount() {
        this.roomRef.on('value', snapshot => {
            let roomData = snapshot.val();
            this.setState({ roomData });
        });
    }

    componentWillUnmount() {
        this.roomRef.off();
    }

    render() {
        const { onClick, room, openState, isOwner, takeAttendance } = this.props;
        const { roomData } = this.state;

        return (
            <div>
                <ListItem button onClick={event => onClick(event, room.id)}>
                    <ListItemText
                        primary={roomData.name}
                        secondary={roomData.description}
                    />
                    <ListItemText
                        primary={<strong style={{fontFamily: 'Courier New, Courier, monospace'}}>{room.code}</strong>}
                    />
                    {openState[room.id] ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openState[room.id]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {isOwner /* TODO: Make this button more conspicuous */
                            ? 
                                <ListItem button onClick={takeAttendance}>
                                    <ListItemText primary="Take Attendance"/>
                                </ListItem>
                            : null
                        }
                        <ListItem>
                            <MemberListItemText owner={true} uid={roomData.owner} firebase={this.props.firebase} />
                        </ListItem>
                        <ListItem>
                            <ListItemText inset primary="Members:" />
                        </ListItem>
                        {roomData.members !== undefined ? Object.keys(roomData.members).map(uid => (
                            <ListItem key={uid}>
                                <MemberListItemText owner={false} uid={uid} firebase={this.props.firebase} />
                            </ListItem>
                        )) : null}
                    </List>
                </Collapse>
            </div>
        );
    }
}

class MemberListItemText extends Component {
    constructor(props) {
        super(props);

        this.userRef = this.props.firebase.user(this.props.uid);

        this.state = {
            memberData: {},
        };
    }

    componentDidMount() {
        this.userRef.on('value', snapshot => {
            let memberData = snapshot.val();
            this.setState({ memberData });
        });
    }

    componentWillUnmount() {
        this.userRef.off();
    }

    render() {
        const { owner } = this.props;
        const { memberData } = this.state;
        return (
            <ListItemText inset primary={(owner ? 'Owner: ' : '') + memberData.name} />
        );
    }
}

const RoomsList = compose(
    withAuth,
    withFirebase,
    withStyles(styles)
)(RoomsListBase);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(RoomsPage);