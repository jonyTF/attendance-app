import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const withAuthorization = (condition, loginOnly=true) => Component => {
    // condition : the condition used to check authUser
    // loginOnly : boolean to check if page requires you to be logged in

    class WithAuthorization extends React.Component {
        componentWillMount() {
            this.listener = this.props.firebase.auth.onAuthStateChanged(
                authUser => {
                    if (!condition(authUser)) {
                        if (loginOnly)
                            this.props.history.push(ROUTES.SIGN_IN);
                        else
                            this.props.history.push(ROUTES.HOME);
                    }
                }
            )
        }

        componentWillUnmount() {
            this.listener();
        }

        render() {
            /*return (
                <AuthUserContext.Consumer>
                    { authUser =>
                        condition(authUser) ? <Component { ...this.props }/> : null
                    }
                </AuthUserContext.Consumer>
            );*/
            
            return (
                <Component { ...this.props } />
            );
        }
    }

    return compose(
        withRouter,
        withFirebase
    )(WithAuthorization);
};

export default withAuthorization;