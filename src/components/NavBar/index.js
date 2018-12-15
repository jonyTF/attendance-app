import React, { Component } from 'react';
import { AppBar, Button, Divider, IconButton, Toolbar, Typography, Menu, MenuItem } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Add from '@material-ui/icons/AddRounded';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { AuthUserContext } from '../Session';
import SignOutItem from '../SignOut';
import * as ROUTES from '../../constants/routes';

const styles = theme => ({
    grow: {
        flexGrow: 1,
    },
    button: {
        textDecoration: 'none',
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,        
    }
});

const INITIAL_STATE = {
    anchorEl_account: null,
    anchorEl_add: null,
};

class NavAuthBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }
    
    handleMenu = (event, name) => {
        this.setState({ ['anchorEl_' + name] : event.currentTarget });
    }

    handleClose = () => {
        this.setState({ ...INITIAL_STATE });
    }

    gotoPath = (path) => {
        this.props.history.push(path);
    }

    render() {
        const { classes } = this.props;
        const { anchorEl_account, anchorEl_add } = this.state;
        const open_account = Boolean(anchorEl_account);
        const open_add = Boolean(anchorEl_add);

        return (
            <div>
                <AppBar position="static" color="default">
                    <Toolbar>
                        <Typography className={classes.grow} variant="h6" color="inherit">
                            Attendance App
                        </Typography>
                        <IconButton
                            name="add"
                            color="inherit"
                            className={classes.button}
                            onClick={(event) => this.handleMenu(event, 'add')}
                        >
                            <Add />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl_add}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                            open={open_add}
                            onClose={this.handleClose}
                        >
                            {/* Placeholder for now...figure out dialog boxes later */}
                            <MenuItem onClick={() => {this.handleClose(); this.gotoPath(ROUTES.NEW)}}>Create</MenuItem>
                            <MenuItem onClick={() => {this.handleClose(); this.gotoPath(ROUTES.NEW)}}>Join</MenuItem>
                        </Menu>

                        <IconButton
                            onClick={(event) => this.handleMenu(event, 'account')}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl_account}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                            open={open_account}
                            onClose={this.handleClose}
                        >
                            <MenuItem onClick={() => {this.handleClose(); this.gotoPath(ROUTES.ROOMS)}}>My Rooms</MenuItem>
                            <MenuItem onClick={() => {this.handleClose(); this.gotoPath(ROUTES.ACCOUNT)}}>My Account</MenuItem>
                            <Divider />
                            <SignOutItem />
                        </Menu>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

// NOTE: Might not need the Sign up button
const NavNoAuthBase = (props) => {
    const { classes } = props;

    return (
        <div>
            <AppBar position="static" color="default">
                <Toolbar>
                    <Typography className={classes.grow} variant="h6" color="inherit">
                        Attendance App
                    </Typography>
                    <Button color="primary" className={classes.button} variant="outlined" onClick={() => props.history.push(ROUTES.SIGN_IN)}>Sign in</Button>
                    <Button color="primary" className={classes.button} variant="contained" onClick={() => props.history.push(ROUTES.SIGN_UP)}>Sign up</Button>
                </Toolbar>
            </AppBar>
        </div>
    );
};

const NavAuth = compose(
    withRouter, 
    withStyles(styles)
)(NavAuthBase);

const NavNoAuth = compose(
    withRouter,
    withStyles(styles)
)(NavNoAuthBase);

const NavBar = ({ authUser }) => {
    
    return (
        <div>
            <AuthUserContext.Consumer>
                {
                    authUser =>
                        authUser ? <NavAuth /> : <NavNoAuth />
                }
            </AuthUserContext.Consumer>
        </div>
    );
};

export default NavBar;