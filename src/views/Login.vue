<template>
  <div class="login-container wrapper">

    <el-form ref="loginForm" :model="loginForm" :inline="false" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
      <el-card>
        <h3 class="title my-3">Livestock Monitoring Login Page</h3>

        <p v-if="errorMessage != ''" class="text-danger">{{ errorMessage }}</p>

        <el-form-item prop="email">
          <el-input v-model="loginForm.email" prefix-icon="el-icon-user" placeholder="Email" />
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-key" type="password" placeholder="Type your password" />
        </el-form-item>

        <el-form-item>
          <el-button :loading="loginLoading" type="primary" style="width:100%;" size="large" @click="handleLogin('loginForm')">Login</el-button>
        </el-form-item>

        <div class="pt-4">
          <el-button size="medium" type="text" @click="registerFormDialog = true">Register user</el-button>
        </div>
      </el-card>
    </el-form>

    <el-dialog title="Register User" :visible.sync="registerFormDialog">
      <el-form ref="registerForm" :model="registerForm" :rules="registerRules" autocomplete="on">

        <el-form-item label="Name" :label-width="formLabelWidth" prop="name">
          <el-input v-model="registerForm.name" autocomplete="off" prefix-icon="el-icon-user" />
        </el-form-item>

        <el-form-item label="Email" :label-width="formLabelWidth" prop="email">
          <el-input v-model="registerForm.email" prefix-icon="el-icon-message" />
        </el-form-item>

        <el-form-item label="Password" :label-width="formLabelWidth" prop="password">
          <el-input v-model="registerForm.password" prefix-icon="el-icon-key" />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="registerFormDialog = false">Cancel</el-button>
        <el-button :loading="registerLoading" type="primary" @click.native.prevent="handleRegister('registerForm')">Register</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { auth } from './dashboard/admin/components/Config/firebase'
import { firestore } from './dashboard/admin/components/Config/firebase'
import { validEmail } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('Please enter the correct email'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the password'))
      } else if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      registerFormDialog: false,
      loginForm: {
        email: 'duc@tut.ac.za',
        password: 'aaaaaa'
      },
      registerForm: {
        name: '',
        email: '',
        password: ''
      },
      loginRules: {
        email: [{ required: true, trigger: 'blur', validator: validateEmail }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      registerRules: {
        name: [{ required: true, trigger: 'blur' }],
        email: [{ required: true, trigger: 'blur', validator: validateEmail }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      formLabelWidth: '120px',
      capsTooltip: false,
      loginLoading: false,
      registerLoading: false,
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
  // mounted() {
  //   console.log(this.$refs['loginForm'])
  //   if (this.loginForm.name === '') {
  //     this.$refs['loginForm'].name.focus()
  //   } else if (this.loginForm.password === '') {
  //     this.$refs['loginForm'].password.focus()
  //   }
  // },
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
    handleLogin(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.loginLoading = true

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
              this.loginLoading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async handleRegister(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.registerLoading = true

          await this.$http.post('register', this.registerForm)
            .then(async(response) => {
              if (response.status === 200) {
                this.$message({
                  message: 'The user has been registered. Now you\'re required to login.',
                  type: 'success'
                })

                this.registerFormDialog = false
                this.$refs[formName].resetFields()
              }
            })
            .catch((error) => {
              const { data } = error
              this.errorMessage = data.message
            })
            .finally(() => {
              this.registerLoading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
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
