<template>
  <div id="users-management">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="All User" name="all">
        <el-card class="box-card">
          <div slot="header" class="d-flex justify-content-between">
            <h5>Users Management</h5>
            <el-button type="primary" @click="isDialogRegisterUserVisible = !isDialogRegisterUserVisible">Register a new Staff</el-button>
          </div>
          <div class="px-4">
            <el-table
              :data="users"
              style="width: 100%"
            >
              <el-table-column
                prop="email"
                label="Email"
              />
              <el-table-column
                prop="firstname"
                label="First Name"
              />
              <el-table-column
                prop="surname"
                label="Surname"
              />
              <el-table-column
                prop="role"
                label="Role"
              />
              <el-table-column
                prop="photo"
                label="Photo"
              />
              <el-table-column
                prop="password"
                label="Password Is Set"
              >
                <template slot-scope="scope">
                  {{ scope.row.password === null ? 'No' : 'Yes' }}
                </template>
              </el-table-column>
              <el-table-column prop="action" label="Action">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    plain
                    circle
                    @click="openEditModal(scope.row.id)"
                  />
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    plain
                    circle
                    @click="openDeleteConfirmationModal(scope.row.id)"
                  />
                </template>
              </el-table-column>
              <el-table-column
                align="right"
              >
                <template slot="header">
                  <el-input
                    v-model="search"
                    placeholder="Type to search by email or name"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="Pending Request" name="pending">
        <el-card class="box-card">
          <div slot="header" class="d-flex justify-content-between">
            <h5>Pending Request</h5>
          </div>
          <div class="px-4">
            <el-table
              :data="pendingRoleRequestList"
              style="width: 100%"
            >
              <el-table-column
                prop="email"
                label="Email"
              />
              <el-table-column
                prop="firstname"
                label="First Name"
              />
              <el-table-column
                prop="surname"
                label="Surname"
              />
              <el-table-column prop="action" label="Action">
                <template slot-scope="scope">
                  <el-popconfirm
                    confirm-button-text="Accept"
                    cancel-button-text="Reject"
                    confirm-button-type="Plain"
                    cancel-button-type="Plain"
                    title="How do you want to respond this request?"
                    @confirm="respondRequest('accept',scope.row.user_id, scope.row.requested_role_id )"
                    @cancel="respondRequest('reject',scope.row.user_id, scope.row.requested_role_id )"
                  >
                    <el-button slot="reference" plain>
                      Respond
                    </el-button>
                  </el-popconfirm>

                </template>
              </el-table-column>
              <el-table-column
                align="right"
              >
                <template slot="header">
                  <el-input
                    v-model="search"
                    placeholder="Type to search by email or name"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- Register user dialog -->
    <el-dialog
      title="Register new User"
      :visible.sync="isDialogRegisterUserVisible"
      width="30%"
    >
      <el-form ref="new_user_form" :model="new_user_form" :rules="rules" label-width="120px">
        <el-form-item label="Email address" prop="email">
          <el-input v-model="new_user_form.email" />
        </el-form-item>

        <el-form-item label="First name" prop="firstname">
          <el-input v-model="new_user_form.firstname" />
        </el-form-item>

        <el-form-item label="Surname" prop="surname">
          <el-input v-model="new_user_form.surname" />
        </el-form-item>

        <el-form-item label="Role" prop="role_id">
          <el-select v-model="new_user_form.role_id" placeholder="Select role" style="width: 100%;">
            <el-option
              v-for="(item, index) in role"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="isDialogRegisterUserVisible = false">Cancel</el-button>
        <el-button @click="resetForm('ruleForm')">Reset</el-button>
        <el-button type="primary" @click="submitRegisterUserForm('new_user_form')">Create</el-button>
      </span>
    </el-dialog>

    <!-- Edit user dialog -->
    <el-dialog
      title="Edit user"
      :visible.sync="isEditUserDialogVisible"
      width="30%"
    >
      <el-form ref="edit_user_form" :model="user_detail" :rules="rules" label-width="120px">
        <el-form-item label="Email address" prop="email">
          <el-input v-model="user_detail.email" />
        </el-form-item>

        <el-form-item label="First name" prop="firstname">
          <el-input v-model="user_detail.firstname" />
        </el-form-item>

        <el-form-item label="Surname" prop="surname">
          <el-input v-model="user_detail.surname" />
        </el-form-item>

        <el-form-item label="Role" prop="role_id">
          <el-select v-model="user_detail.role_id" placeholder="Select role" style="width: 100%;">
            <el-option
              v-for="(item, index) in role"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="isEditUserDialogVisible = false">Cancel</el-button>
        <el-button @click="resetForm('edit_user_form')">Reset</el-button>
        <el-button type="primary" @click="submitEditUserForm('edit_user_form')">Create</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data: () => {
    return {
      activeTab: 'all',
      isDialogRegisterUserVisible: false,
      isEditUserDialogVisible: false,
      new_user_form: {
        firstname: '',
        surname: '',
        email: '',
        role_id: ''
      },
      user_detail: {
        email: '',
        firstname: '',
        surname: '',
        role: '',
        photo: '',
        password: ''
      },
      search: '',
      users: [],
      pendingRequest: [],
      role: [],
      rules: {
        firstname: [
          { required: true, message: 'Please input First Name', trigger: 'blur' }
        ],
        surname: [
          { required: true, message: 'Please input Surname', trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'Please input email', trigger: 'change' },
          { type: 'email', message: 'Email is not valid', trigger: 'change' }
        ],
        role_id: [
          { required: true, message: 'Please select user role', trigger: 'blur' }
        ]
      }
    }
  },

  computed: {
    pendingRoleRequestList() {
      if (this.pendingRequest && this.users) {
        return this.pendingRequest.map(request => {
          const user = this.users.find(item => item.id === request.user_id)
          const role = this.role.find(role => role.id === request.requested_role_id)
          return { ...request, ...user, ...role }
        })
      }

      return []
    }
  },

  async mounted() {
    this.fetchUsers()
    this.fetchPendingRoleRequest()
    this.fetchRole()
  },

  methods: {
    async respondRequest(action, user_id, role_id) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      switch (action) {
        case 'accept': {
          const payload = {
            'user_id': user_id,
            'requested_role_id': role_id,
            'status': 'accept'
          }
          console.log(payload)
          await this.$http.put(`role/respond`, payload)
            .then((response) => {
              if (response.status === 200) {
                this.$message({
                  type: 'success',
                  message: 'Request has been approved'
                })
              }
            })
            .catch((error) => {
              console.error(error)
            })
          break
        }
        case 'reject': {
          const payload = {
            'user_id': user_id,
            'requested_role_id': role_id,
            'status': 'reject'
          }
          await this.$http.put(`role/respond`, payload)
            .then((response) => {
              if (response.status === 200) {
                this.$message({
                  type: 'success',
                  message: 'Request has been rejected'
                })
              }
            })
            .catch((error) => {
              console.error(error)
            })
          break
        }
        default:
          return
      }
      loading.close()
      this.fetchPendingRoleRequest()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    openEditModal(id) {
      this.user_detail = this.users.find((user) => user.id === id)
      this.isEditUserDialogVisible = true
    },
    openDeleteConfirmationModal(id) {
      const h = this.$createElement

      this.$msgbox({
        title: 'Delete user',
        message: h('p', null, [
          h('span', null, 'Are you sure to delete this user? This action cannot be undone')
        ]),
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        beforeClose: async(action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = 'Loading...'

            const request = await this.$http.delete(`users/${id}`)

            if (request.status === 200) {
              const index = this.users.findIndex(obj => obj.id === id)
              this.users.splice(index, 1)
              this.$message({
                type: 'success',
                message: 'User deleted'
              })
            } else {
              this.$message({
                type: 'error',
                message: 'Please try again'
              })
            }
          }
          done()
          instance.confirmButtonLoading = false
        }
      })
    },
    submitEditUserForm(formName) {

    },
    submitRegisterUserForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          const request = await this.$http.post('users', this.new_user_form)

          if (request.status === 201) {
            alert('Success')
          } else {
            alert('Not success')
          }

          this.isDialogRegisterUserVisible = false
          this.$refs[formName].resetFields()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async fetchRole() {
      const { data } = await this.$http.get('role')
      data.data.data.forEach((value) => {
        this.role.push({
          id: value.id,
          name: value.name
        })
      })
    },
    async fetchUsers() {
      const { data } = await this.$http.get('users')
      data.users.data.forEach((value) => {
        this.users.push({
          id: value.id,
          email: value.email,
          firstname: value.firstname,
          surname: value.surname,
          role: value.role,
          password: value.password,
          photo: 'No photo for now'
        })
      })
    },
    async fetchPendingRoleRequest() {
      const { data } = await this.$http.get('role/request/list/pending')
      this.pendingRequest = data.data.data
    }
  }
}
</script>

<style lang="scss">
</style>
