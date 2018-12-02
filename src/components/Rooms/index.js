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

        this.rootRef = this.props.firebase.root();
        this.state = {
            ownedRooms: [],
            rooms: [],
            openState: [],
        }
    }

    componentDidMount() {
        this.rootRef.on('value', snapshot => {
            let users = snapshot.val().users;
            let user = users[this.props.authUser.uid];
            let userRooms = user.rooms;
            let globalRooms = snapshot.val().rooms;
            
            let ownedRooms = [];
            let rooms = [];
            let openState = [];
            let id = 0;
            for (let room in userRooms) {
                const code = userRooms[room].code;
                
                let members = [];
                for (let member in globalRooms[code].members) {
                    let m = globalRooms[code].members[member];
                    let u = users[m.uid];
                    members.push({
                        uid: m.uid,
                        firstName: u.firstName,
                        lastName: u.lastName,
                        owner: m.owner,
                    });
                }

                let newList = userRooms[room].owner ? ownedRooms : rooms;
                newList.push({
                    id: id,
                    name: globalRooms[code].name,
                    description: globalRooms[code].description,
                    code: code,
                    members: members,
                });
                openState.push(false);
                id++;
            }
            this.setState({ ownedRooms, rooms, openState });
        });
    }

    componentWillUnmount() {
        this.rootRef.off();
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

    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <h2>Rooms I own</h2>
                {this.state.ownedRooms.length > 0
                    ? <RoomsListComponent isOwner={true} takeAttendance={this.takeAttendance} openState={this.state.openState} rooms={this.state.ownedRooms} onClick={this.onClick} classes={classes} />
                    : <div>You have not created any rooms!</div>
                }
                <h2>Rooms I am in</h2>
                {this.state.rooms.length > 0
                    ? <RoomsListComponent isOwner={false} openState={this.state.openState} rooms={this.state.rooms} onClick={this.onClick} classes={classes} />
                    : <div>You have not joined any rooms!</div>
                }
            </div>
        );
    }
}

// TODO: Have options for each group (delete, display code in big dialog box, etc.)
// TODO: Make it so you can change room settings (change name, remove members, delete room, unjoin room, etc.)
const RoomsListComponent = ({ classes, rooms, onClick, openState, isOwner, takeAttendance }) => (
    <List className={classes.root}>
        {rooms.map((room) => (
            <div key={room.id}>
                <ListItem button onClick={(event) => onClick(event, room.id)}>
                    <ListItemText
                        primary={room.name}
                        secondary={room.description}
                    />
                    <ListItemText
                        primary={<strong>{room.code}</strong>}
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
                            <ListItemText inset primary="Members:" />
                        </ListItem>
                        {room.members.map(member => (
                            <ListItem key={member.uid}>
                                <ListItemText inset primary={member.firstName + ' ' + member.lastName + (member.owner ? ' (Owner)' : '')} />
                            </ListItem>
                        ))}
                    </List>
                </Collapse>
            </div>
        ))}
    </List>
);

const RoomsList = compose(
    withAuth,
    withFirebase,
    withStyles(styles)
)(RoomsListBase);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(RoomsPage);