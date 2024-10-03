importScripts('https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.1.2/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyDbboJRjtV4skQ_oSQnaHVMwPdLcctg6Go",
    authDomain: "sauced-8e5ee.firebaseapp.com",
    projectId: "sauced-8e5ee",
    storageBucket: "sauced-8e5ee.appspot.com",
    messagingSenderId: "406307069293",
    appId: "1:406307069293:web:f675ddbbe4cb64240bce64",
    measurementId: "G-M5KZ6NX1ZX"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
