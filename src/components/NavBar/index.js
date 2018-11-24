import React, { Component } from 'react';
import { AppBar, Button, Divider, IconButton, Toolbar, Typography, Menu, MenuItem } from '@material-ui/core';
import { Link } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import AccountCircle from '@material-ui/icons/AccountCircle';

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

class NavAuthBase extends Component {
    constructor(props) {
        super(props);

        this.state = {
            anchorEl: null,
        };
    }
    
    handleAccountMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    }

    handleAccountClose = event => {
        this.setState({ anchorEl: null });
    }

    render() {
        const { classes } = this.props;
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);

        return (
            <div>
                <AppBar position="static" color="default">
                    <Toolbar>
                        <Typography className={classes.grow} variant="title" color="inherit">
                            Attendance App
                        </Typography>
                        <Link to={ROUTES.CREATE} className={classes.button}>
                            <Button color="primary" variant="contained">Create</Button>
                        </Link>
                        <IconButton
                            onClick={this.handleAccountMenu}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="account_menu"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                            open={open}
                            onClose={this.handleAccountClose}
                        >
                            <Link to={ROUTES.ROOMS} style={{textDecoration: 'none'}}><MenuItem onClick={this.handleAccountClose}>My Rooms</MenuItem></Link>
                            <Link to={ROUTES.ACCOUNT} style={{textDecoration: 'none'}}><MenuItem onClick={this.handleAccountClose}>My Account</MenuItem></Link>
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
                    <Typography className={classes.grow} variant="title" color="inherit">
                        Attendance App
                    </Typography>
                    <Link to={ROUTES.SIGN_IN} className={classes.button}>
                        <Button color="primary" variant="outlined">Log in</Button>
                    </Link>
                    <Link to={ROUTES.SIGN_UP} className={classes.button}>
                        <Button color="primary" variant="contained">Sign up</Button>
                    </Link>
                </Toolbar>
            </AppBar>
        </div>
    );
};

const NavAuth = withStyles(styles)(NavAuthBase);
const NavNoAuth = withStyles(styles)(NavNoAuthBase);

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