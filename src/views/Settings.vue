<template>
  <el-card>
    <el-row :gutter="24">
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <el-button @click="is_dialog_change_password_visible = !is_dialog_change_password_visible">Change Password</el-button>
        </div>
      </el-col>
    </el-row>

    <!-- Change password dialog -->
    <el-dialog title="Change Password" :visible.sync="is_dialog_change_password_visible">
      <el-form ref="change_password_form" :label-position="label_position" label-width="150px" :model="change_password_form" :rules="rules">
        <el-form-item label="Current Password" prop="old_password">
          <el-input v-model="change_password_form.old_password" autocomplete="off" show-password />
        </el-form-item>
        <hr>
        <el-form-item label="New Password" prop="new_password">
          <el-input v-model="change_password_form.new_password" autocomplete="off" show-password />
        </el-form-item>
        <el-form-item label="Confirm Password" prop="new_password_confirmation">
          <el-input v-model="change_password_form.new_password_confirmation" autocomplete="off" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('change_password_form')">Create</el-button>
          <el-button @click="resetForm('change_password_form')">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<script>
import { Message } from 'element-ui'

export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the password'))
      } else {
        if (this.change_password_form.new_password !== '') {
          this.$refs.change_password_form.validateField('checkPass')
        }
        callback()
      }
    }
    const validateConfirmationPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the password again'))
      } else if (value !== this.change_password_form.new_password) {
        callback(new Error('Two inputs don\'t match!'))
      } else {
        callback()
      }
    }

    return {
      is_dialog_change_password_visible: false,
      label_position: 'right',
      change_password_form: {
        old_password: '',
        new_password: '',
        new_password_confirmation: ''
      },
      rules: {
        new_password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        new_password_confirmation: [
          { validator: validateConfirmationPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          console.log(this.change_password_form)
        }
      })
    }
  }
}
</script>
