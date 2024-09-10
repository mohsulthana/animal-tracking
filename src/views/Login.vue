<template>
  <div class="authentication-container wrapper">

    <el-form ref="loginForm" :model="loginForm" :inline="false" :rules="loginRules" class="authentication-form" autocomplete="on" label-position="left">
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

        <h6 class="text-center">OR</h6>

        <div class="pt-2 d-flex justify-content-center">
          <div
            id="g_id_onload"
            data-client_id="194374654068-meplsk1hikummfumkm6m8o7llovh42c1.apps.googleusercontent.com"
            data-callback="handleCredentialResponse"
            data-auto_prompt="false"
            data-ux_mode="popup"
          />
          <div
            class="g_id_signin"
            data-type="standard"
            data-size="large"
            data-theme="filled_blue"
            data-text="sign_in_with"
            data-shape="rectangular"
            data-logo_alignment="left"
            data-locale="en-ZA"
          />
        </div>

        <hr>
        <div class="pt-5">
          <el-button size="small" type="text" @click="forgotPasswordDialog = true">Forgot Password</el-button>
        </div>
      </el-card>
    </el-form>

    <el-dialog title="Forgot Password" :visible.sync="forgotPasswordDialog">
      <el-form ref="forgotPasswordForm" :model="forgotPasswordForm" :rules="forgotPasswordRules" autocomplete="off">
        <el-form-item label="Email" :label-width="formLabelWidth" prop="email">
          <el-input v-model="forgotPasswordForm.email" placeholder="Your email" prefix-icon="el-icon-message" />
        </el-form-item>
      </el-form>

      <p v-if="forgot_password_success_message !== ''" class="text-success">{{ forgot_password_success_message }}</p>
      <el-button v-if="forgot_password_success_message !== ''" type="outline" @click="$router.push({ name: 'reset-password', query: { email: savedEmail }})">Verify your PIN here</el-button>

      <span slot="footer" class="dialog-footer">
        <el-button @click="forgotPasswordDialog = false">Close</el-button>
        <el-button :loading="forgotPasswordLoading" type="primary" @click.prevent="handleForgotPassword('forgotPasswordForm')">Send Link</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { validEmail } from '@/utils/validate'
import VueJwtDecode from 'vue-jwt-decode'

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
      clientId: process.env.VUE_APP_GOOGLE_CLIENT_ID,
      forgotPasswordDialog: false,
      loginForm: {
        // email: 'duc@tut.ac.za',
        // password: 'aaaaaa'
        email: '',
        password: ''
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
      forgotPasswordRules: {
        email: [{ required: true, trigger: 'blur', validator: validateEmail }]
      },
      forgotPasswordForm: {
        email: ''
      },
      passwordType: 'password',
      formLabelWidth: '120px',
      capsTooltip: false,
      loginLoading: false,
      forgotPasswordLoading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      errorMessage: '',
      forgot_password_success_message: '',
      savedEmail: ''
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
  beforeMount() {
    window.handleCredentialResponse = this.handleCredentialResponse
  },
  methods: {
    async handleCredentialResponse(response) {
      const decoded = VueJwtDecode.decode(response.credential)

      const loading = this.$loading({
        lock: true,
        text: 'Logging in',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      const payload = { ...decoded, login_with: 'google' }

      await this.$http.post('login-with-google', payload)
        .then(async(response) => {
          const token = response.data.access_token
          const user = response.data.user

          await this.$store.dispatch('auth/setToken', token)
          await this.$store.dispatch('auth/setUser', user)
          this.$message({
            message: 'You have successfully authrozied. Directing you to the dashboard',
            type: 'success'
          })

          setTimeout(() => {
            this.$router.push({ name: 'dashboard' })
          }, 1000)
        })
        .catch((error) => {
          const { data } = error
          this.errorMessage = data.message
        })
        .finally(() => {
          loading.close()
        })
    },
    handleForgotPassword(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.forgotPasswordLoading = true

          this.savedEmail = this.forgotPasswordForm.email

          await this.$http.post('password/forgot', this.forgotPasswordForm)
            .then((response) => {
              if (response.status === 200) {
                this.forgot_password_success_message = response.data.message

                this.$refs[formName].resetFields()
              }
            })
            .catch((error) => {
              console.log(error)
            })
            .finally(() => {
              this.forgotPasswordLoading = false
            })
        }
      })
    },
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
              const user = response.data.user

              await this.$store.dispatch('auth/setToken', token)
              await this.$store.dispatch('auth/setUser', user)
              this.$message({
                message: 'You have successfully authrozied. Directing you to the dashboard',
                type: 'success'
              })

              setTimeout(() => {
                this.$router.push({ name: 'dashboard' })
              }, 1000)
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
          this.forgotPasswordLoading = true

          await this.$http.post('register', this.registerForm)
            .then(async(response) => {
              if (response.status === 200) {
                this.$message({
                  message: 'The user has been registered. Now you\'re required to login.',
                  type: 'success'
                })

                this.forgotPasswordDialog = false
                this.$refs[formName].resetFields()
              }
            })
            .catch((error) => {
              const { data } = error
              this.errorMessage = data.message
            })
            .finally(() => {
              this.forgotPasswordLoading = false
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
  },
  head: {
    script: [
      {
        type: 'text/javascript', src: 'https://accounts.google.com/gsi/client', async: true
      }
    ]
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#1be71b;
$light_gray:#fff;
$cursor: #fff;
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#141414;
$light_gray:#0f0f0f;
</style>
