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
import { auth } from './dashboard/admin/components/Config/firebase'
import { firestore } from './dashboard/admin/components/Config/firebase'
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
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
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

      await this.$http.post('login', this.loginForm)
        .then(async(response) => {
          const token = response.data.access_token
          await this.$store.dispatch('auth/setToken', token)
          // this.$router.push({ name: 'dashboard' })
          this.$message({
            message: 'You have successfully authrozied. Directing you to the dashboard',
            type: 'success'
          })

          this.$router.go(0)

          // TODO: Fix routing problem after login
        })
        .catch((error) => {
          const { data } = error
          this.errorMessage = data.message
        })
        .finally(() => {
          this.loading = false
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
