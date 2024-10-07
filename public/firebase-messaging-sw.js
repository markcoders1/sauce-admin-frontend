importScripts('https://www.gstatic.com/firebasejs/10.6.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.6.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDbboJRjtV4skQ_oSQnaHVMwPdLcctg6Go",
  authDomain: "sauced-8e5ee.firebaseapp.com",
  projectId: "sauced-8e5ee",
  storageBucket: "sauced-8e5ee.appspot.com",
  messagingSenderId: "406307069293",
  appId: "1:406307069293:web:f72e92507f75cf960bce64",
  measurementId: "G-X0NSRVJKL5"
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();
// Optional: Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    // icon: '/firebase-logo.png' // Optional: Add an icon if desired
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});