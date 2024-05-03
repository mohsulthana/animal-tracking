<template>
  <div class="login-container wrapper">

    <el-form ref="loginForm" :model="loginForm" :inline="false" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
      <el-card>
        <h3 class="title my-3">Livestock Monitoring Login Page</h3>

        <p v-if="errorMessage != ''" class="text-danger">{{ errorMessage }}</p>

        <el-form-item>
          <el-input v-model="loginForm.email" prefix-icon="el-icon-user" placeholder="Email" />
        </el-form-item>

        <el-form-item>
          <el-input v-model="loginForm.password" prefix-icon="el-icon-key" type="password" placeholder="Type your password" />
        </el-form-item>

        <el-button :loading="loading" type="primary" style="width:100%;" size="large" @click.native.prevent="handleLogin">Login</el-button>
      </el-card>
    </el-form>
  </div>
</template>

<script>
import { auth } from '../dashboard/admin/components/Config/firebase'
import { firestore } from '../dashboard/admin/components/Config/firebase'
import { validEmail } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('Please enter the correct email'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('Please enter the correct email'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        email: 'duc@tut.ac.za',
        password: 'aaaaaa'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      RegisterForm: {
        email: 'duzhuofeng73@gmail.com',
        password: '111111'
      },
      RegisterRules: {
        email: [{ required: true, trigger: 'blur', validator: validateEmail }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      auth,
      firestore,
      errorMessage: ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {

    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    /* this.$store.state.data.firstanimalsnapshot = 1
    this.$store.state.data.firstanimalcategoriessnapshot = 1
    this.$store.state.data.firstfootagesnapshot = 1
    this.$store.state.data.firstgenderssnapshot = 1
    this.$store.state.data.firstusersnapshot = 1*/
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    async handleLogin() {
      this.loading = true

      await this.$http.post('api/login', this.loginForm)
        .then((response) => {
          const token = response.data.access_token
          this.$store.dispatch('auth/setToken', token)
          this.$router.push({ name: 'dashboard' })
          this.$message({
            message: 'You have successfully authrozied. Directing you to the dashboard',
            type: 'success'
          })
        })
        .catch((error) => {
          const { data } = error
          this.errorMessage = data.message
        })
        .finally(() => {
          this.loading = false
        })

      /* this.$store.dispatch('user/login', this.loginForm)
          .then(() => {
          this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
            this.loading = false
          })
          .catch(() => {
          this.loading = false
          })*/

      /* console.log("Before setAuthPersistence")
      this.$store.getters.setAuthPersistence.then(() => {
        alert('Successfully logged in database, click to start pulling data');
        this.$store.getters.getAnimalsAndFootages.then(() => {
          this.$store.dispatch('user/login', this.loginForm)
                    .then(() => {
                    this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
                      this.loading = false
                    })
                    .catch(() => {
                    this.loading = false
                    })
                console.log("Got "+this.$store.state.data.footages.length+ " footages")
                console.log(this.$store)
        })
      })*/
      // this.$store.state.data.footages = []
      // this.$store.state.data.animals = []
      // this.$store.state.data.animalcategories = []
      // this.$store.state.data.genders = []
      // this.$store.state.data.users = []

      // auth.setPersistence('local')
      //   .then(() => {
      //     // console.log(this.loginForm.username)
      //     auth.signInWithEmailAndPassword(this.loginForm.username, this.loginForm.password)
      //       .then(() => {
      //         alert('Successfully logged in, click to start pulling data')
      //         var that = this
      //         that.$store.state.data.logedinEmail = that.loginForm.username
      //         that.$store.state.data.password = that.loginForm.password

      //         // load users
      //         firestore
      //           .collection('users')
      //           .onSnapshot(function(snapshot) {
      //             console.log('get in users loading')
      //             /* console.log("First user snapshot? "+ that.$store.state.data.firstusersnapshot)
      //           if(that.$store.state.data.firstusersnapshot){
      //             that.$store.state.data.users = []
      //             //console.log("getters.firstfootages: "+that.$store.getters.firstfootagesnapshot)
      //             that.$store.state.data.firstusersnapshot = 0
      //             //console.log("getters.firstfootages: "+that.$store.getters.firstfootagesnapshot)
      //           }*/
      //             snapshot.docChanges().forEach(function(change) {
      //               console.log(change.doc.data().email)

      //               switch (change.type) {
      //                 case 'added':
      //                   that.$store.state.data.users.push({
      //                     ...change.doc.data(),
      //                     userID: change.doc.id
      //                   })
      //                   break
      //                 case 'modified':
      //                   var a = that.$store.state.data.users.find(user => user.userID === change.doc.id)
      //                   Vue.set(that.$store.state.data.users,
      //                     that.$store.state.data.users.indexOf(a),
      //                     { ...change.doc.data(), ...{ userID: change.doc.id }})
      //                   break
      //                 case 'removed':
      //                   var b = that.$store.state.data.users.find(user => user.userID === change.doc.id)
      //                   that.$store.state.data.users.splice(that.$store.state.data.users.indexOf(b), 1)
      //                   break
      //                 default:
      //                   break
      //               }
      //             })

      //             console.log('Got ' + that.$store.state.data.users.length + ' users')
      //             console.log(that.$store.state.data.users)
      //             var user = that.$store.getters.users.find(user => user.email === that.loginForm.username)
      //             console.log(user)

      //             if (user) {
      //               that.role = user.role
      //               console.log('Login Email:' + that.loginForm.username + ' role: ' + that.role)
      //             } else {
      //               alert('The login email does not have permission to access data')
      //               this.$router.push('/')
      //               return
      //             }
      //           })

      //         // load animals
      //         firestore
      //           .collection('animals')
      //           .onSnapshot(function(snapshot) {
      //             console.log('First animal snapshot? ' + that.$store.state.data.firstanimalsnapshot)
      //             /* if(that.$store.state.data.firstanimalsnapshot){
      //             that.$store.state.data.animals = []
      //             that.$store.state.data.firstanimalsnapshot = 0
      //           }*/
      //             snapshot.docChanges().forEach(function(change) {
      //               switch (change.type) {
      //                 case 'added':
      //                   that.$store.state.data.animals.push({
      //                     ...change.doc.data(),
      //                     animalID: change.doc.id
      //                   })
      //                   break
      //                 case 'modified':
      //                   var a = that.$store.state.data.animals.find(animal => animal.animalID === change.doc.id)
      //                   Vue.set(that.$store.state.data.animals,
      //                     that.$store.state.data.animals.indexOf(a),
      //                     { ...change.doc.data(), ...{ animalID: change.doc.id }})
      //                   break
      //                 case 'removed':
      //                   var b = that.$store.state.data.animals.find(animal => animal.animalID === change.doc.id)
      //                   that.$store.state.data.animals.splice(that.$store.state.data.animals.indexOf(b), 1)
      //                   break
      //                 default:
      //                   break
      //               }
      //               console.log(change.type + ' animal: ' + change.doc.data())
      //             })
      //             console.log('Got ' + that.$store.state.data.animals.length + ' animals')
      //           })

      //         // load animalcategories
      //         firestore
      //           .collection('animalcategories')
      //           .onSnapshot(function(snapshot) {
      //             /* console.log("First animalcategories snapshot? "+ that.$store.state.data.firstanimalcategoriessnapshot)
      //           if(that.$store.state.data.firstanimalcategoriessnapshot){
      //             that.$store.state.data.animalcategories = []
      //             that.$store.state.data.firstanimalcategoriessnapshot = 0
      //           }*/
      //             snapshot.docChanges().forEach(function(change) {
      //               switch (change.type) {
      //                 case 'added':
      //                   that.$store.state.data.animalcategories.push({
      //                     ...change.doc.data(),
      //                     categoryID: change.doc.id
      //                   })
      //                   break
      //                 case 'modified':
      //                   var a = that.$store.state.data.animalcategories.find(category => category.categoryID === change.doc.id)
      //                   Vue.set(that.$store.state.data.animalcategories,
      //                     that.$store.state.data.animalcategories.indexOf(a),
      //                     { ...change.doc.data(), ...{ categoryID: change.doc.id }})
      //                   break
      //                 case 'removed':
      //                   var b = that.$store.state.data.animalcategories.find(category => category.categoryID === change.doc.id)
      //                   that.$store.state.data.animalcategories.splice(that.$store.state.data.animalcategories.indexOf(b), 1)
      //                   break
      //                 default:
      //                   break
      //               }
      //               console.log(change.type + ' animalcategory: ' + change.doc.data())
      //             })
      //             console.log('Got ' + that.$store.state.data.animalcategories.length + ' animal categories')
      //           })

      //         // load genders
      //         firestore
      //           .collection('genders')
      //           .onSnapshot(function(snapshot) {
      //             /* console.log("First genders snapshot? "+ that.$store.state.data.firstgenderssnapshot)
      //           if(that.$store.state.data.firstgenderssnapshot){
      //             that.$store.state.data.genders = []
      //             that.$store.state.data.firstgenderssnapshot = 0
      //           }*/
      //             snapshot.docChanges().forEach(function(change) {
      //               switch (change.type) {
      //                 case 'added':
      //                   that.$store.state.data.genders.push({
      //                     ...change.doc.data(),
      //                     genderID: change.doc.id
      //                   })
      //                   break
      //                 case 'modified':
      //                   var a = that.$store.state.data.genders.find(gen => gen.genderID === change.doc.id)
      //                   Vue.set(that.$store.state.data.genders,
      //                     that.$store.state.data.genders.indexOf(a),
      //                     { ...change.doc.data(), ...{ categoryID: change.doc.id }})
      //                   break
      //                 case 'removed':
      //                   var b = that.$store.state.data.genders.find(gen => gen.gendersID === change.doc.id)
      //                   that.$store.state.data.genders.splice(that.$store.state.data.genders.indexOf(b), 1)
      //                   break
      //                 default:
      //                   break
      //               }
      //               console.log(change.type + ' gender: ' + change.doc.data())
      //             })
      //             console.log('Got ' + that.$store.state.data.genders.length + ' genders')
      //           })

      //         // load footages
      //         firestore
      //           .collection('footages')
      //           .onSnapshot(function(snapshot) {
      //             console.log('First footage snapshot? ' + that.$store.state.data.firstfootagesnapshot)
      //             if (that.$store.state.data.firstfootagesnapshot) {
      //               that.$store.state.data.footages = []
      //               // console.log("getters.firstfootages: "+that.$store.getters.firstfootagesnapshot)
      //               that.$store.state.data.firstfootagesnapshot = 0
      //             // console.log("getters.firstfootages: "+that.$store.getters.firstfootagesnapshot)
      //             }
      //             snapshot.docChanges().forEach(function(change) {
      //               if (change.type === 'added') {
      //                 that.$store.state.data.footages.push({
      //                   ...change.doc.data(),
      //                   footageID: change.doc.id
      //                 })
      //               }
      //             })
      //             console.log('Got ' + that.$store.state.data.footages.length + ' footages')

      //             var logedUser = {
      //               username: '',
      //               password: ''
      //             }
      //             switch (that.role) {
      //               case 'admin':
      //                 logedUser.username = 'admin'
      //                 break
      //                 // case "developer":
      //                 //  logedUser.username = 'editor'
      //                 //  break;
      //               default:
      //                 logedUser.username = 'editor'

      //                 break
      //             }
      //             console.log(logedUser.username)
      //             that.$store.dispatch('user/login', logedUser)
      //               .then(() => {
      //                 that.$router.push('/')
      //                 that.loading = false
      //               })
      //               .catch(() => {
      //                 that.loading = false
      //               })
      //           })
      //       })
      //       .catch(error => {
      //         // this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
      //         alert(error.message)
      //         this.loading = false
      //         return false
      //       })
      //   })
      //   .catch(error => {
      //     // this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
      //     alert(error.message)
      //     this.loading = false
      //     return false
      //   })

      // })
      // .catch((error) => {
      // Handle Errors here.
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // });

      /* firebase
      .auth()
      .signInWithEmailAndPassword('duzhuofeng73@gmail.com', '111111')
      .then(() => {
        alert('Successfully logged in database, click to start pulling data');

        firebase.firestore().collection('animals').get().then(docs=>{
          docs.forEach(doc=>{
            this.$store.commit("addanimal", ({...doc.data(),...{animalID:doc.id}}))
          })
        })
        firebase.firestore().collection('footages').get().then(docs=>{
          docs.forEach(doc=>{
            this.$store.commit("addfootage", ({...doc.data(),...{footageID:doc.id}}))
          })
          console.log(this.$store.state.footages.length)
          this.$store.dispatch('user/login', this.loginForm)
              .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
                this.loading = false
              })
              .catch(() => {
              this.loading = false
              })
        })
      })
      .catch(error => {
        //this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
        alert(error.message);
        this.loading = false
        return false
      });*/
      /* this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })*/
    },
    handleRegister() {
      // console.log(firebase.auth())
      auth.createUserWithEmailAndPassword(this.RegisterForm.email, this.RegisterForm.password)
        .then(() => {
          alert('Successfully registered! Please login.')
          this.$router.push('/')
        })
        .catch(error => {
          alert(error.message)
        })
    },

    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }

    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#1be71b;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    font-size: 1.25rem;
    font-weight: 600;
    border-radius: 6px;
    transition: 0.2s ease;

    input {
      border-radius: 4px;
      color:rgb(22, 21, 21);
      height: 47px;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#141414;
$light_gray:#0f0f0f;

.wrapper {
  opacity:1;
  background: url("~@/assets/background_for_app.jpg") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  min-height: 100vh;
  overflow: hidden;
  /* Height for devices larger than 576px */
  @media (min-width: 992px) {
      #intro {
        margin-top: -58.59px;
      }
    }

    .navbar .nav-link {
      color: #fff !important;
    }
}

.login-container {
  min-height: 100%;
  width: 100%;
  background-color:#f0f2f5;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 100%;
    max-width: 1000px;
    padding: 300px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 4rem;
    color: #0a0a0a;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color:#0a0a0a;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color:#0a0a0a;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color:#0a0a0a;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
