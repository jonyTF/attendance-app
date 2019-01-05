import firebase from 'firebase';
import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
//import 'firebase/messaging';
import { isMobile } from 'react-device-detect';

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
        //this.messaging = app.messaging();
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
        return (firebase.auth.EmailAuthProvider.credential(email, password));
    }

    doSetPersistence = (remember) =>
        this.auth.setPersistence(remember ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION);

    doSignInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
        provider.addScope('https://www.googleapis.com/auth/userinfo.email');
        
        if (isMobile)
            return this.auth.signInWithRedirect(provider);
        return this.auth.signInWithPopup(provider);
    }

    doGetRedirectResult = () =>
        this.auth.getRedirectResult();

    // *** Messaging API ***

    /*doRequestNotificationPermission = () =>
        this.messaging.requestPermission();

    doGetMessagingToken = () =>
        this.messaging.getToken();

    messaging = () => this.messaging;*/

    // *** Database API ***

    user = uid => this.db.ref(`users/${uid}`);

    users = () => this.db.ref('users');
    
    userRoom = (uid, roomCode) => this.db.ref(`users/${uid}/rooms/${roomCode}`);

    userRooms = uid => this.db.ref(`users/${uid}/rooms`);

    globalRoom = roomCode => this.db.ref(`rooms/${roomCode}`);
    
    globalRoomMember = (uid, roomCode) => this.db.ref(`rooms/${roomCode}/members/${uid}`);

    globalRoomMembers = roomCode => this.db.ref(`rooms/${roomCode}/members`);

    globalRooms = () => this.db.ref('rooms/');

    root = () => this.db.ref('/');
}

export default Firebase;
