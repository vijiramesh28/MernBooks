import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDEj9GYCHlzskVsv4-BkKdUOnG9QUdXwsU",
    authDomain: "bookshop-mern.firebaseapp.com",
    projectId: "bookshop-mern",
    storageBucket: "bookshop-mern.appspot.com",
    messagingSenderId: "45176533441",
    appId: "1:45176533441:web:8be41829fc5687a8b27f40"
  };

//   const firebaseApp = firebase.initializeApp(firebaseConfig);
//   const auth = firebaseApp.auth;
//   const googelProvider = new firebase.auth.GoogleAuthProvider();

const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebaseApp.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

export {auth, googleProvider}