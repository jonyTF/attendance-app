import React from 'react';
import { Avatar, Paper, Typography } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
    paper: {
        marginTop: theme.spacing.unit * 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main,
    },
    content: {
        width: '100%',
        marginTop: theme.spacing.unit * 2,
    },
});

const PaperBase = props => {
    const { classes } = props;

    return (
        <Paper className={classes.paper}>
            {props.iconComponent &&
                <Avatar className={classes.avatar}>
                    <props.iconComponent />
                </Avatar>
            }
            {props.title && 
                <Typography component="h1" variant="h5">
                    {props.title}
                </Typography>
            }
            <div className={classes.content}>
                {props.children}
            </div>
        </Paper>
    );
};

export default withStyles(styles)(PaperBase);