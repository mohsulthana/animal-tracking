<template>
  <div id="gender-management">
    <el-row :span="24">
      <el-col>
        <el-card class="box-card">
          <div slot="header" class="d-flex justify-content-between">
            <h5>Gender Management</h5>
            <el-button type="primary" @click="isDialogNewGenderVisible = !isDialogNewGenderVisible">Add new Gender</el-button>
          </div>
          <div class="px-4">
            <el-table
              :data="gender"
              style="width: 100%"
            >
              <el-table-column
                prop="name"
                label="Name"
              />
              <el-table-column prop="action" label="Action">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    plain
                    circle
                  />
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    plain
                    circle
                    @click="openDeleteConfirmationModal(scope.row.GID)"
                  />
                </template>
              </el-table-column>
              <el-table-column
                align="right"
              >
                <template slot="header">
                  <el-input
                    v-model="search"
                    placeholder="Type to search gender name"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      title="Add new Gender"
      :visible.sync="isDialogNewGenderVisible"
      width="30%"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">

        <el-form-item label="Gender name" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="isDialogNewGenderVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitForm('form')">Add</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'Gender',
  data: () => {
    return {
      isDialogNewGenderVisible: false,
      form: {
        name: ''
      },
      search: '',
      gender: [],
      role: [],
      rules: {
        name: [
          { required: true, message: 'Please input Gender Name', trigger: 'blur' }
        ]
      }
    }
  },

  async mounted() {
    this.fetchGender()
  },

  methods: {
    openDeleteConfirmationModal(id) {
      const h = this.$createElement

      this.$msgbox({
        title: 'Delete gender',
        message: h('p', null, [
          h('span', null, 'Are you sure to delete this gender? This action cannot be undone')
        ]),
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        beforeClose: async(action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = 'Loading...'

            const request = await this.$http.delete(`gender/${id}`)

            if (request.status === 200) {
              const index = this.gender.findIndex(obj => obj.GID === id)
              this.gender.splice(index, 1)
              this.$message({
                type: 'success',
                message: 'Gender deleted'
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
          const request = await this.$http.post('gender', this.form)

          if (request.status === 201) {
            alert('Success')
          } else {
            alert('Not success')
          }

          this.isDialogNewGenderVisible = false
          this.$refs[formName].resetFields()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async fetchGender() {
      const { data } = await this.$http.get('gender')
      data.gender.data.forEach((value) => {
        this.gender.push(value)
      })
    }
  }
}
</script>

  <style lang="scss">
  </style>
