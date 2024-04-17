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
                align="right"
              >
                <template slot="header" slot-scope="scope">
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
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="Email address">
          <el-input v-model="form.name" />
        </el-form-item>

        <el-form-item label="First name">
          <el-input v-model="form.name" />
        </el-form-item>

        <el-form-item label="Last name">
          <el-input v-model="form.name" />
        </el-form-item>

        <el-form-item label="Role">
          <el-input v-model="form.name" />
        </el-form-item>

        <el-form-item label="Password">
          <el-input v-model="form.name" />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="isDialogRegisterUserVisible = false">Cancel</el-button>
        <el-button type="primary" @click="isDialogRegisterUserVisible = false">Confirm</el-button>
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
        name: ''
      },
      search: '',
      users: []
    }
  },

  async mounted() {
    const { data } = await this.$http.get('api/users')
    data.data.forEach((value) => {
      this.users.push({
        email: value.email,
        first_name: value.firstname,
        surname: value.surname,
        role: value.role,
        photo: 'No photo for now'
      })
    })
  },

  methods: {

  }
}
</script>

<style lang="scss">
</style>
