import React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

const NavBar = () => (
    <div>
        <AppBar position="static">
            <Toolbar>
                <Typography variant="title" color="inherit">
                    Attendance App
                </Typography>
            </Toolbar>
        </AppBar>
    </div>
);

export default NavBar;