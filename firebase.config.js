import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDbboJRjtV4skQ_oSQnaHVMwPdLcctg6Go",
    authDomain: "sauced-8e5ee.firebaseapp.com",
    projectId: "sauced-8e5ee",
    storageBucket: "sauced-8e5ee.appspot.com",
    messagingSenderId: "406307069293",
    appId: "1:406307069293:web:f675ddbbe4cb64240bce64",
    measurementId: "G-M5KZ6NX1ZX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
