import React, { Component } from 'react';
import { compose } from 'recompose';
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, Collapse, IconButton, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import { ExpandLess, ExpandMore, HowToReg, MoreVert } from '@material-ui/icons';

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
    },
    expand: {
        marginLeft: 'auto',
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    button: {
        margin: theme.spacing.unit,
    },
});

var roomsList = {};

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
        /*this.props.firebase.messaging.onTokenRefresh(() => {
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
        });*/

        /*
        curl -X POST -H "Authorization: key=AAAAZO0uiwg:APA91bHaIR-gx_tnCbTEITYTXBufw0AWStRr7FrpcvO8BmKGIU2LO0S3F5yrV55Im7r2xpe4Ii6cVPxitImjOS-ewGJd0esbYnh5lQ1q4bVLi666z5_mlIMkHIfik6LGz3IDB6cxo6Ga" -H "Content-Type: application/json" -d '{
            "notification": {
                "title": "FCM Message",
                "body": "This is an FCM Message",
            },
            "to": "d_iRcsmMs90:APA91bHw2rp9hkc8Q0LFjCriB10cuMc8LIxAc2fZmGHzlbRm3AQH_ucBOXBSJenN6DXEHmtnbHqemUIxTO9Sm3XxHoaGmb_8xmhJyG3INl7f-w29zPZ5qybXzyfu-ePbQMYg5HljBqGl"
        }' https://fcm.googleapis.com/fcm/send
        */

        /*
        curl -X POST -H "Authorization: key=AAAAZO0uiwg:APA91bHaIR-gx_tnCbTEITYTXBufw0AWStRr7FrpcvO8BmKGIU2LO0S3F5yrV55Im7r2xpe4Ii6cVPxitImjOS-ewGJd0esbYnh5lQ1q4bVLi666z5_mlIMkHIfik6LGz3IDB6cxo6Ga" -H "Content-Type: application/json" -H "project_id: 433475980040" -d '{
            "operation": "create",
            "notification_key_name": "test",
            "registration_ids": ["d_iRcsmMs90:APA91bHw2rp9hkc8Q0LFjCriB10cuMc8LIxAc2fZmGHzlbRm3AQH_ucBOXBSJenN6DXEHmtnbHqemUIxTO9Sm3XxHoaGmb_8xmhJyG3INl7f-w29zPZ5qybXzyfu-ePbQMYg5HljBqGl"]
        }' https://fcm.googleapis.com/fcm/notification
        */

        /*
        curl -X POST -H "Authorization: key=AAAAZO0uiwg:APA91bHaIR-gx_tnCbTEITYTXBufw0AWStRr7FrpcvO8BmKGIU2LO0S3F5yrV55Im7r2xpe4Ii6cVPxitImjOS-ewGJd0esbYnh5lQ1q4bVLi666z5_mlIMkHIfik6LGz3IDB6cxo6Ga" -H "Content-Type: application/json" -d '{
            "message": {
                "topic" : "4y44gq",
                "notification": {
                "body": "This is a Firebase Cloud Messaging Topic Message!",
                "title": "FCM Message"
                }
            }
        }' https://fcm.googleapis.com/v1/projects/myproject-b5ae1/messages:send HTTP/1.1
        */
    }

    /*updateToken(token) {
        this.props.firebase
            .user(this.props.authUser.uid)
            .child('token')
            .set(token);
    }*/

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

    takeAttendance = (roomCode) => {
        /*for (let user in roomsList[roomCode]) {
            if (roomsList[roomCode][user].token !== undefined) {
                fetch('https://fcm.googleapis.com/fcm/send', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'key=AAAAZO0uiwg:APA91bHaIR-gx_tnCbTEITYTXBufw0AWStRr7FrpcvO8BmKGIU2LO0S3F5yrV55Im7r2xpe4Ii6cVPxitImjOS-ewGJd0esbYnh5lQ1q4bVLi666z5_mlIMkHIfik6LGz3IDB6cxo6Ga',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        notification: {
                            title: 'Taking attendance',
                            body: 'You\'d better open this app'
                        },
                        "data": {
                            "title": "FCM Message",
                            "body": "This is an FCM Message",
                        },
                        "to": roomsList[roomCode][user].token
                    })
                });
            } else {

            }
        }*/
        fetch('https://fcm.googleapis.com/v1/projects/attendance-app-dev/messages:send', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer fb5WdopocGQ9N0fBmR8MFxIvtJ8NhGiiwlITpJmc',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                topic: '4y44gq',
                notification: {
                    body: 'body body',
                    title: 'IMPORTANT'
                }
            })
        }).then(response => response.json())
        .then(data => {
            console.log(data);
        }).catch(err => {
            console.log(err);
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
            <div>
                {rooms.map((room) => (
                    <div key={room.id}>
                        <RoomCard 
                            classes={classes}
                            onClick={onClick} 
                            room={room} 
                            openState={openState} 
                            isOwner={isOwner} 
                            takeAttendance={takeAttendance} 
                            firebase={this.props.firebase}
                        />
                    </div>
                ))}
            </div>
        );
    }
}

class RoomCard extends Component {
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
        const { classes, onClick, room, openState, isOwner, takeAttendance } = this.props;
        const { roomData } = this.state;

        return (
            <Card>
                <CardHeader
                    avatar={
                        <Avatar>{roomData.name ? roomData.name.charAt(0) : ''}</Avatar>
                    }
                    action={
                        <IconButton>
                            <MoreVert />
                        </IconButton>
                    }
                    title={roomData.name}
                    subheader={'Owner: ' + roomData.owner}
                />
                <CardContent>
                    <Typography>
                        {roomData.description}
                    </Typography>
                    <Typography>
                        <strong style={{fontFamily: 'Courier New, Courier, monospace'}}>{room.code}</strong>
                    </Typography>
                </CardContent>
                <CardActions>
                    {isOwner
                        ?
                            <div>
                                <Button
                                    onClick={() => takeAttendance(this.props.room.code)}
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                >
                                    <HowToReg className={classes.leftIcon} />
                                    Take Attendance
                                </Button>
                            </div>
                        : null
                    }
                    <IconButton
                        className={classes.expand}
                        onClick={event => onClick(event, room.id)}
                    >
                        {openState[room.id] ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                </CardActions>
                <Collapse in={openState[room.id]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItem>
                            <MemberListItemText owner={true} uid={roomData.owner} firebase={this.props.firebase} />
                        </ListItem>
                        <ListItem>
                            <ListItemText inset primary="Members:" />
                        </ListItem>
                        {roomData.members !== undefined ? Object.keys(roomData.members).map(uid => (
                            <ListItem key={uid}>
                                <MemberListItemText owner={false} roomCode={this.props.room.code} uid={uid} firebase={this.props.firebase} />
                            </ListItem>
                        )) : null}
                    </List>
                </Collapse>
            </Card>
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

            if (!this.props.owner) {
                if (!roomsList[this.props.roomCode]) {
                    roomsList[this.props.roomCode] = {};
                }
                roomsList[this.props.roomCode][this.props.uid] = memberData;
            }
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