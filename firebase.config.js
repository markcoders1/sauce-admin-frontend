import { initializeApp } from "firebase/app";
import { useEffect } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getMessaging, getToken , onMessage  } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyDbboJRjtV4skQ_oSQnaHVMwPdLcctg6Go",
    authDomain: "sauced-8e5ee.firebaseapp.com",
    projectId: "sauced-8e5ee",
    storageBucket: "sauced-8e5ee.appspot.com",
    messagingSenderId: "406307069293",
    appId: "1:406307069293:web:f675ddbbe4cb64240bce64",
    measurementId: "G-M5KZ6NX1ZX"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const messaging = getMessaging(app); 



export { auth, messaging };