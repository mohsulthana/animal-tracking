<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { firestore } from './views/dashboard/admin/components/Config/firebase'
import { auth } from './views/dashboard/admin/components/Config/firebase'
import Vue from 'vue'
import axios from './utils/axios'

export default {

  name: 'App',
  components: {
  },
  data() {
    return {
    }
  },
  async mounted() {
  },
  // below created() solves the problem of lossing $store data when refresh a page by clicking the refresh button
  created() {
    const that = this

    // Read sessionStorage on page load
    if (sessionStorage.getItem('store')) {
      // console.log(that.$store.state)

      // load state from sessionStorage
      that.$store.replaceState(Object.assign({}, that.$store.state, JSON.parse(sessionStorage.getItem('store'))))
      // console.log(that.$store.state)

      // setup the snapshot of database
      if (that.$store.state.data.logedinEmail) {
        auth.setPersistence('local')
          .then(() => {
            // console.log(that.loginForm.username)
            auth.signInWithEmailAndPassword(that.$store.state.data.logedinEmail, that.$store.state.data.password)
              .then(() => {
                // that.$store.state.data.logedinEmail = that.loginForm.username
                // that.$store.state.data.password = that.loginForm.password

                // clear store to pull in firestore data and establish snapshot listener
                // that.$store.state.tagsView.visitedViews = []
                that.$store.state.data.footages = []
                that.$store.state.data.animals = []
                that.$store.state.data.animalcategories = []
                that.$store.state.data.genders = []
                that.$store.state.data.users = []

                // load users
                firestore
                  .collection('users')
                  .onSnapshot(function(snapshot) {
                    /* console.log("First user snapshot? "+ that.$store.state.data.firstusersnapshot)
                  if(that.$store.state.data.firstusersnapshot){
                    that.$store.state.data.users = []
                    //console.log("getters.firstfootages: "+that.$store.getters.firstfootagesnapshot)
                    that.$store.state.data.firstusersnapshot = 0
                    //console.log("getters.firstfootages: "+that.$store.getters.firstfootagesnapshot)
                  }*/
                    snapshot.docChanges().forEach(function(change) {
                      switch (change.type) {
                        case 'added':
                          that.$store.state.data.users.push({
                            ...change.doc.data(),
                            userID: change.doc.id
                          })
                          break
                        case 'modified':
                          var a = that.$store.state.data.users.find(user => user.userID === change.doc.id)
                          Vue.set(that.$store.state.data.users,
                            that.$store.state.data.users.indexOf(a),
                            { ...change.doc.data(), ...{ userID: change.doc.id }})
                          break
                        case 'removed':
                          var a = that.$store.state.data.users.find(user => user.userID === change.doc.id)
                          that.$store.state.data.users.splice(that.$store.state.data.users.indexOf(a), 1)
                          break
                        default:
                          break
                      }
                    })

                    console.log('Got ' + that.$store.state.data.users.length + ' users')
                    console.log(that.$store.state.data.users)
                  /* var user = that.$store.getters.users.find(user => user.email === that.$store.state.data.logedinEmail)
                  console.log(user)
                  var role = ''
                  if (user){
                    role = user.role
                    console.log('Email:' + user.email + ' role: ' + role)
                    var logedUser = {
                      username: '',
                      password: ''
                    }
                    switch (role){
                      case "admin":
                        logedUser.username = 'admin'
                        break;
                      case "developer":
                        logedUser.username = 'developer'
                        break;
                      default:
                        logedUser.username = 'editor'

                        break;
                    }
                    console.log(logedUser.username)
                    that.$store.dispatch('user/login', logedUser)
                        .then(() => {
                          //that.$router.push('/')
                          that.loading = false
                        })
                        .catch(() => {
                        that.loading = false
                        })
                    }
                  else{
                    alert('The login email does not have permission to access data')
                    that.$router.push('/');
                  }*/
                  })

                // load animals
                firestore
                  .collection('animals')
                  .onSnapshot(function(snapshot) {
                    console.log('First animal snapshot? ' + that.$store.state.data.firstanimalsnapshot)
                    /* if(that.$store.state.data.firstanimalsnapshot){
                    that.$store.state.data.animals = []
                    that.$store.state.data.firstanimalsnapshot = 0
                  }*/
                    snapshot.docChanges().forEach(function(change) {
                      switch (change.type) {
                        case 'added':
                          that.$store.state.data.animals.push({
                            ...change.doc.data(),
                            animalID: change.doc.id
                          })
                          break
                        case 'modified':
                          var a = that.$store.state.data.animals.find(animal => animal.animalID === change.doc.id)
                          Vue.set(that.$store.state.data.animals,
                            that.$store.state.data.animals.indexOf(a),
                            { ...change.doc.data(), ...{ animalID: change.doc.id }})
                          break
                        case 'removed':
                          var a = that.$store.state.data.animals.find(animal => animal.animalID === change.doc.id)
                          that.$store.state.data.animals.splice(that.$store.state.data.animals.indexOf(a), 1)
                          break
                        default:
                          break
                      }
                      console.log(change.type + ' animal: ' + change.doc.data())
                    })
                    console.log('Got ' + that.$store.state.data.animals.length + ' animals')
                  })

                // load animalcategories
                firestore
                  .collection('animalcategories')
                  .onSnapshot(function(snapshot) {
                    /* console.log("First animalcategories snapshot? "+ that.$store.state.data.firstanimalcategoriessnapshot)
                  if(that.$store.state.data.firstanimalcategoriessnapshot){
                    that.$store.state.data.animalcategories = []
                    that.$store.state.data.firstanimalcategoriessnapshot = 0
                  }*/
                    snapshot.docChanges().forEach(function(change) {
                      switch (change.type) {
                        case 'added':
                          that.$store.state.data.animalcategories.push({
                            ...change.doc.data(),
                            categoryID: change.doc.id
                          })
                          break
                        case 'modified':
                          var a = that.$store.state.data.animalcategories.find(category => category.categoryID === change.doc.id)
                          Vue.set(that.$store.state.data.animalcategories,
                            that.$store.state.data.animalcategories.indexOf(a),
                            { ...change.doc.data(), ...{ categoryID: change.doc.id }})
                          break
                        case 'removed':
                          var a = that.$store.state.data.animalcategories.find(category => category.categoryID === change.doc.id)
                          that.$store.state.data.animalcategories.splice(that.$store.state.data.animalcategories.indexOf(a), 1)
                          break
                        default:
                          break
                      }
                      console.log(change.type + ' animalcategory: ' + change.doc.data())
                    })
                    console.log('Got ' + that.$store.state.data.animalcategories.length + ' animal categories')
                  })

                // load genders
                firestore
                  .collection('genders')
                  .onSnapshot(function(snapshot) {
                    /* console.log("First genders snapshot? "+ that.$store.state.data.firstgenderssnapshot)
                  if(that.$store.state.data.firstgenderssnapshot){
                    that.$store.state.data.genders = []
                    that.$store.state.data.firstgenderssnapshot = 0
                  }*/
                    snapshot.docChanges().forEach(function(change) {
                      switch (change.type) {
                        case 'added':
                          that.$store.state.data.genders.push({
                            ...change.doc.data(),
                            genderID: change.doc.id
                          })
                          break
                        case 'modified':
                          var a = that.$store.state.data.genders.find(gen => gen.genderID === change.doc.id)
                          Vue.set(that.$store.state.data.genders,
                            that.$store.state.data.genders.indexOf(a),
                            { ...change.doc.data(), ...{ categoryID: change.doc.id }})
                          break
                        case 'removed':
                          var a = that.$store.state.data.genders.find(gen => gen.gendersID === change.doc.id)
                          that.$store.state.data.genders.splice(that.$store.state.data.genders.indexOf(a), 1)
                          break
                        default:
                          break
                      }
                      console.log(change.type + ' gender: ' + change.doc.data())
                    })
                    console.log('Got ' + that.$store.state.data.genders.length + ' genders')
                  })

                // load footages
                firestore
                  .collection('footages')
                  .onSnapshot(function(snapshot) {
                    console.log('First footage snapshot? ' + that.$store.state.data.firstfootagesnapshot)
                    if (that.$store.state.data.firstfootagesnapshot) {
                      that.$store.state.data.footages = []
                      // console.log("getters.firstfootages: "+that.$store.getters.firstfootagesnapshot)
                      that.$store.state.data.firstfootagesnapshot = 0
                    // console.log("getters.firstfootages: "+that.$store.getters.firstfootagesnapshot)
                    }
                    snapshot.docChanges().forEach(function(change) {
                      if (change.type === 'added') {
                        that.$store.state.data.footages.push({
                          ...change.doc.data(),
                          footageID: change.doc.id
                        })
                      }
                    })
                    console.log('Got ' + that.$store.state.data.footages.length + ' footages')
                  })
              })
              .catch(error => {
                // that.$router.push({ path: that.redirect || '/', query: that.otherQuery })
                alert(error.message)
                that.loading = false
                return false
              })
          })
          .catch(error => {
            // that.$router.push({ path: that.redirect || '/', query: that.otherQuery })
            alert(error.message)
            that.loading = false
            return false
          })
      } else {
        console.log('App.vue: got store but not yet loged in')
      }
    } else {
      console.log('App.vue: not yet loged in')
    }

    // Save the store to sessionStorage when the page is refreshed
    window.addEventListener('beforeunload', () => {
      console.log('App.vue: before unload')
      sessionStorage.setItem('store', JSON.stringify(that.$store.state))
      console.log('App.vue: after store to the sessionStorage')
    })
    console.log('App.vue: before remove store from the sessionStorage')
    console.log(that.$store.state)
    sessionStorage.removeItem('store')
    console.log('App.vue: after remove store from the sessionStorage')
    console.log(that.$store.state)
  },
  methods: {
  }
}
</script>
<style lang ="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #050001;
  background-size: cover;
  // min-height:130vh;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
