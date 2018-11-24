import React from 'react';
import { Button } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
    submit: {
        marginTop: theme.spacing.unit * 3,
    },
});

const PaperFormBase = props => {
    const { classes } = props;

    return (
        <form onSubmit={props.onSubmit}>
            {props.children}
            {props.submitBtnText &&
                <Button 
                    variant="contained"
                    color="primary"
                    type="submit"
                    className={classes.submit}
                    fullWidth
                >
                    {props.submitBtnText}
                </Button>
            }
        </form>
    );
};

export default withStyles(styles)(PaperFormBase);