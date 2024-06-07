<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { auth } from './views/dashboard/admin/components/Config/firebase'

export default {
  name: 'App',
  components: {},
  data() {
    return {}
  },
  async mounted() {},
  // below created() solves the problem of lossing $store data when refresh a page by clicking the refresh button
  created() {
    const that = this

    // Read sessionStorage on page load
    if (sessionStorage.getItem('store')) {
      // console.log(that.$store.state)

      // load state from sessionStorage
      that.$store.replaceState(
        Object.assign(
          {},
          that.$store.state,
          JSON.parse(sessionStorage.getItem('store'))
        )
      )
      // console.log(that.$store.state)

      // setup the snapshot of database
      if (that.$store.state.data.logedinEmail) {
        auth
          .setPersistence('local')
          .then(() => {
            // console.log(that.loginForm.username)
            auth
              .signInWithEmailAndPassword(
                that.$store.state.data.logedinEmail,
                that.$store.state.data.password
              )
              .then(() => {
                // that.$store.state.data.logedinEmail = that.loginForm.username
                // that.$store.state.data.password = that.loginForm.password

                // clear store to pull in firestore data and establish snapshot listener
                // that.$store.state.tagsView.visitedViews = []
              })
              .catch((error) => {
                // that.$router.push({ path: that.redirect || '/', query: that.otherQuery })
                alert(error.message)
                that.loading = false
                return false
              })
          })
          .catch((error) => {
            // that.$router.push({ path: that.redirect || '/', query: that.otherQuery })
            alert(error.message)
            that.loading = false
            return false
          })
      }
    }

    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('store', JSON.stringify(that.$store.state))
    })
    sessionStorage.removeItem('store')
  },
  methods: {}
}
</script>
<style lang="scss">
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
