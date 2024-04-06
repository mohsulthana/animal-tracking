
import firebase from 'firebase'
// import 'firebase/firestore'
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyBCDczpSPh0XAp2soGsszlR5wowic23x5c',
    authDomain: 'animal-project-603cc.firebaseapp.com',
    databaseURL: 'https://animal-project-603cc-default-rtdb.firebaseio.com',
    projectId: 'animal-project-603cc',
    storageBucket: 'animal-project-603cc.appspot.com',
    messagingSenderId: '98693816910',
    appId: '1:98693816910:web:bb203117590fcdfb03d91f',
    measurementId: 'G-FJHJ6FJFS0'
  })
}

const state = {
  firestore: null,
  auth: null
  /* firebaseConfig: {
    apiKey: "AIzaSyBCDczpSPh0XAp2soGsszlR5wowic23x5c",
    authDomain: "animal-project-603cc.firebaseapp.com",
    databaseURL: "https://animal-project-603cc-default-rtdb.firebaseio.com",
    projectId: "animal-project-603cc",
    storageBucket: "animal-project-603cc.appspot.com",
    messagingSenderId: "98693816910",
    appId: "1:98693816910:web:bb203117590fcdfb03d91f",
    measurementId: "G-FJHJ6FJFS0",
  },*/

}

const mutations = {
  getFirestore: state => { state.firestore = firebase.firestore() },
  getauth: state => { state.auth = firebase.auth() }

}
const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
/* if(!firebase.apps.length){
  const firebaseConfig = {
  apiKey: "AIzaSyBCDczpSPh0XAp2soGsszlR5wowic23x5c",
  authDomain: "animal-project-603cc.firebaseapp.com",
  databaseURL: "https://animal-project-603cc-default-rtdb.firebaseio.com",
  projectId: "animal-project-603cc",
  storageBucket: "animal-project-603cc.appspot.com",
  messagingSenderId: "98693816910",
  appId: "1:98693816910:web:bb203117590fcdfb03d91f",
  measurementId: "G-FJHJ6FJFS0",
  };

  firebase.initializeApp(firebaseConfig);
  firebase
  .auth()
  .signInWithEmailAndPassword('duzhuofeng73@gmail.com', '111111')
  .then(() => {

  })
  .catch(error => {
    //this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
    alert(error.message);
    this.loading = false
    return false
  });
  firebase
    .firestore()
    .enablePersistence({ synchronizeTabs: !0 })
    .catch(() => {
      console.warn("DB offline support not available")
    });

   }
var auth = firebase.auth();*/
/* export default {
  firestore: firebase.firestore(),
  };*/

/* var firestore = firebase.firestore();

export {firestore};

export { auth };
*/

