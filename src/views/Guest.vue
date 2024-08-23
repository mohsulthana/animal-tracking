<template>
  <div id="guest">
    <el-card>
      <el-empty v-if="requests.filter((req) => req.user_id === $store.getters.user.id && req.status === 'pending').length < 1" description="You're logged in as Guest. Please request to our admin to which menu you would like to access.">
        <el-button type="primary" @click="isRequestDialogOpen = true">Request Access</el-button>
      </el-empty>
      <el-result v-else icon="info" title="Information" sub-title="Your request has been sent. Please wait until the Admin approves your request">
        <template slot="extra">
          <el-button type="primary" size="medium" @click="$router.go(0)">Refresh</el-button>
        </template>
      </el-result>
    </el-card>

    <el-dialog
      title="Request Access"
      :visible.sync="isRequestDialogOpen"
      width="30%"
      center
    >
      <el-form ref="requestForm" :rules="rules" :model="accessForm">
        <p>Please choose which role you want to request access for</p>
        <el-form-item label="Access type" prop="role_id">
          <el-select v-model="accessForm.role_id" placeholder="Select" style="width: 100%;">
            <el-option
              v-for="item in access"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.value === parseInt($store.getters.user.role_id)"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="isButtonLoading" @click="isRequestDialogOpen = false">Cancel</el-button>
        <el-button type="primary" :loading="isButtonLoading" @click="sendRequest('requestForm')">Send</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      requests: [],
      isRequestDialogOpen: false,
      accessForm: {
        role_id: null
      },
      access: [{
        value: 1,
        label: 'Admin'
      }, {
        value: 2,
        label: 'Editor'
      }, {
        value: 3,
        label: 'Guest'
      }],
      isButtonLoading: false,
      rules: {
        role_id: [
          { required: true, message: 'Role is required' }
        ]
      }
    }
  },
  mounted() {
    this.fetchRequest()
  },
  methods: {
    async fetchRequest() {
      await this.$http.get('role/request/list')
        .then((response) => {
          this.requests = response.data.data.data
        })
        .catch((error) => {
          console.log(error)
        })
    },
    sendRequest(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.isButtonLoading = true
          const payload = {
            requested_role_id: this.accessForm.role_id,
            user_id: this.$store.getters.user.id,
            status: 'pending'
          }

          await this.$http.post('role/request/new', payload)
            .then((response) => {
              if (response.status === 200) {
                this.$message({
                  type: 'success',
                  message: 'Request sent'
                })
                this.isRequestDialogOpen = false
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
