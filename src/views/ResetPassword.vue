<template>
  <div class="authentication-container wrapper">
    <el-form ref="resetPasswordForm" :model="resetPasswordForm" :rules="rules" label-width="120px" class="authentication-form">
      <el-card>
        <h3 class="title my-3">Reset Tracking Password</h3>

        <el-form-item label="Email" prop="email">
          <el-input v-model="resetPasswordForm.email" placeholder="Input your email here" type="email" autocomplete="on" />
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-model="resetPasswordForm.password" show-password type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Confirm" prop="password_confirmation">
          <el-input v-model="resetPasswordForm.password_confirmation" show-password type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.prevent="submitForm('resetPasswordForm')">Submit</el-button>
          <el-button @click="resetForm('resetPasswordForm')">Reset</el-button>
        </el-form-item>
      </el-card>
    </el-form>
  </div>
</template>

<script>
import { validEmail } from '@/utils/validate'

export default {
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
      } else {
        if (this.resetPasswordForm.password_confirmation !== '') {
          this.$refs.resetPasswordForm.validateField('password_confirmation')
        }
        callback()
      }
    }
    const validatePasswordConfirmation = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the password again'))
      } else if (value !== this.resetPasswordForm.password) {
        callback(new Error('Two inputs don\'t match!'))
      } else {
        callback()
      }
    }
    return {
      resetPasswordForm: {
        email: '',
        password: '',
        password_confirmation: ''
      },
      rules: {
        password: [
          { required: true, validator: validatePassword, trigger: 'blur' },
          { min: 8, message: 'Password length should be min. 8 character', trigger: 'blur' }
        ],
        password_confirmation: [
          { required: true, validator: validatePasswordConfirmation, trigger: 'blur' },
          { min: 8, message: 'Password length should be min. 8 character', trigger: 'blur' }
        ],
        email: [{ required: true, trigger: 'blur', validator: validateEmail }]
      }
    }
  },
  mounted() {
    if (this.$route.query.email) {
      this.resetPasswordForm.email = this.$route.query.email
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          const email = this.$route.query.email
          const payload = { email, ...this.resetPasswordForm }
          console.log(payload)
          await this.$http.post('password/reset', payload)
            .then(({ data, status }) => {
              if (status === 200) {
                this.$message({
                  message: data.message,
                  type: 'success'
                })
                this.$router.push({ name: 'login' })
                this.$refs[formName].resetFields()
              }
            })
            .catch((error) => {
              console.log(error)
            })
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
