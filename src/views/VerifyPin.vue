<template>
  <div class="authentication-container wrapper">
    <el-form ref="verify_pin_form" :model="form" :inline="false" :rules="formRules" class="authentication-form" autocomplete="on" label-position="left">
      <el-card>
        <h3 class="title my-3">Verify your pin</h3>

        <el-form-item prop="email">
          <el-input v-model="form.email" prefix-icon="el-icon-message" placeholder="Input your email" />
        </el-form-item>

        <el-form-item prop="token">
          <el-input v-model="form.token" prefix-icon="el-icon-key" placeholder="Input your PIN" />
        </el-form-item>
        <div class="pt-4">
          <el-button size="medium" type="primary" :loading="isButtonLoading" @click.native.prevent="verify('verify_pin_form')">Verify</el-button>
        </div>
      </el-card>
    </el-form>
  </div>
</template>

<script>
import { validEmail } from '@/utils/validate'

export default {
  name: 'VerifyPin',
  data() {
    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('Please enter the correct email'))
      } else {
        callback()
      }
    }
    return {
      isButtonLoading: false,
      formRules: {
        email: [{ required: true, trigger: 'blur', validator: validateEmail }],
        token: [{ required: true, trigger: 'blur' }]
      },
      form: {
        token: '',
        email: this.$route.query.email || ''
      }
    }
  },
  methods: {
    verify(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.isButtonLoading = true
          await this.$http.post('verify/pin', this.form)
            .then(({ status, data }) => {
              if (status === 200) {
                this.$message({
                  message: data.message,
                  type: 'success'
                })
                this.$router.push({ name: 'reset-password' })
              }
            })
            .catch((error) => {
              console.log(error)
            })
            .finally(() => {
              this.isButtonLoading = false
            })
        }
      })
    }
  }
}
</script>
