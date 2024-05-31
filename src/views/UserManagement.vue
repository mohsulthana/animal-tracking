<template>
  <div id="users-management">
    <el-row :span="24">
      <el-col>
        <el-card class="box-card">
          <div slot="header" class="d-flex justify-content-between">
            <h5>Users Management</h5>
            <el-button type="primary" @click="isDialogRegisterUserVisible = !isDialogRegisterUserVisible">Register a new User</el-button>
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
                prop="first_name"
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
                  <!-- <el-button
                    type="primary"
                    icon="el-icon-edit"
                    plain
                    circle
                  /> -->
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
      </el-col>
    </el-row>

    <el-dialog
      title="Register new User"
      :visible.sync="isDialogRegisterUserVisible"
      width="30%"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="Email address" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>

        <el-form-item label="First name" prop="firstname">
          <el-input v-model="form.firstname" />
        </el-form-item>

        <el-form-item label="Surname" prop="surname">
          <el-input v-model="form.surname" />
        </el-form-item>

        <el-form-item label="Role" prop="role_id">
          <el-select v-model="form.role_id" placeholder="Select role" style="width: 100%;">
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
        <el-button type="primary" @click="submitForm('form')">Create</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'Users',
  data: () => {
    return {
      isDialogRegisterUserVisible: false,
      form: {
        firstname: '',
        surname: '',
        email: '',
        role_id: ''
      },
      search: '',
      users: [],
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

  async mounted() {
    this.fetchRole()
    this.fetchUsers()
  },

  methods: {
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
    submitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          const request = await this.$http.post('users', this.form)

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
          first_name: value.firstname,
          surname: value.surname,
          role: value.role,
          password: value.password,
          photo: 'No photo for now'
        })
      })
    }
  }
}
</script>

<style lang="scss">
</style>
