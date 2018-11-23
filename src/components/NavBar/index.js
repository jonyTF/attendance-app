import React from 'react';
import { AppBar, Button, Toolbar, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';

import { AuthUserContext } from '../Session';
import SignOutButton from '../SignOut';
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

const NavAuthBase = (props) => {
    const { classes } = props;

    return (
        <div>
            <AppBar position="static" color="default">
                <Toolbar>
                    <Typography className={classes.grow} variant="title" color="inherit">
                        Attendance App
                    </Typography>
                    <SignOutButton className={classes.button}/>
                </Toolbar>
            </AppBar>
        </div>
    );
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