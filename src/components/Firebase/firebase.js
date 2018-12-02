import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
    constructor() {
        app.initializeApp(config);
        this.auth = app.auth();
        this.db = app.database();
    }

    // *** Auth API ***

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
        this.auth.currentUser.updatePassword(password);

    doReauthenticateAndRetrieveDataWithCredential = credential =>
        this.auth.currentUser.reauthenticateAndRetrieveDataWithCredential(credential);

    doCreateCredential = (email, password) => {
        return (app.auth.EmailAuthProvider.credential(email, password));
    }

    doSetPersistence = (remember) =>
        this.auth.setPersistence(remember ? app.auth.Auth.Persistence.LOCAL : app.auth.Auth.Persistence.SESSION);

    // *** User API ***

    user = uid => this.db.ref(`users/${uid}`);

    users = () => this.db.ref('users');

    userRooms = uid => this.db.ref(`users/${uid}/rooms`);

    globalRoom = code => this.db.ref(`rooms/${code}`);
    
    globalRoomMembers = code => this.db.ref(`rooms/${code}/members`);

    globalRooms = () => this.db.ref('rooms/');

    root = () => this.db.ref('/');
}

export default Firebase;