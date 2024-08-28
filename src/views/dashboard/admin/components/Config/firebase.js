
import firebase from 'firebase'
import 'firebase/firestore'
if (!firebase.apps.length) {
  const firebaseConfig = {
    apiKey: 'AIzaSyBCDczpSPh0XAp2soGsszlR5wowic23x5c',
    authDomain: 'animal-project-603cc.firebaseapp.com',
    databaseURL: 'https://animal-project-603cc-default-rtdb.firebaseio.com',
    projectId: 'animal-project-603cc',
    storageBucket: 'animal-project-603cc.appspot.com',
    messagingSenderId: '98693816910',
    appId: '1:98693816910:web:bb203117590fcdfb03d91f',
    measurementId: 'G-FJHJ6FJFS0'
  }

  firebase.initializeApp(firebaseConfig)
  firebase
    .auth()
    .signInWithEmailAndPassword('duc@tut.ac.za', 'aaaaaa')
    .then(() => {

    })
    .catch(error => {
    // this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
      alert(error.message)
      this.loading = false
      return false
    })
  firebase
    .firestore()
    .enablePersistence({ synchronizeTabs: !0 })
    .catch(() => {
      console.warn('DB offline support not available')
    })
  firebase.auth().setPersistence('local')
}
var auth = firebase.auth()
export default {
  firestore: firebase.firestore()
}

var firestore = firebase.firestore()
var firestorage = firebase.storage()
// const admin = require('firebase-admin');
export { firestore }
export { auth }
export { firestorage }
// export { admin };

