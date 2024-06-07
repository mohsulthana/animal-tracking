<template>
  <div id="category-management">
    <el-row :span="24">
      <el-col>
        <el-card class="box-card">
          <div slot="header" class="d-flex justify-content-between">
            <h5>Category Management</h5>
            <el-button type="primary" @click="isDialogNewCategoryVisible = !isDialogNewCategoryVisible">Add new Category</el-button>
          </div>
          <div class="px-4">
            <el-table
              :data="category"
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
                    placeholder="Type to search category name"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      title="Add new Category"
      :visible.sync="isDialogNewCategoryVisible"
      width="30%"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">

        <el-form-item label="Category name" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="isDialogNewCategoryVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitForm('form')">Add</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'Category',
  data: () => {
    return {
      isDialogNewCategoryVisible: false,
      form: {
        name: ''
      },
      search: '',
      category: [],
      role: [],
      rules: {
        name: [
          { required: true, message: 'Please input Category Name', trigger: 'blur' }
        ]
      }
    }
  },

  async mounted() {
    this.fetchCategory()
  },

  methods: {
    openDeleteConfirmationModal(id) {
      const h = this.$createElement

      this.$msgbox({
        title: 'Delete category',
        message: h('p', null, [
          h('span', null, 'Are you sure to delete this category? This action cannot be undone')
        ]),
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        beforeClose: async(action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = 'Loading...'

            const request = await this.$http.delete(`category/${id}`)

            if (request.status === 200) {
              const index = this.category.findIndex(obj => obj.id === id)
              this.category.splice(index, 1)
              this.$message({
                type: 'success',
                message: 'Category deleted'
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
          await this.$http.post('category', this.form)
            .then((response) => {
              if (response.status === 201) {
                this.$message({
                  type: 'success',
                  message: 'Category added'
                })

                this.isDialogNewCategoryVisible = false
                this.$refs[formName].resetFields()
                this.fetchCategory()
              } else {
                this.$message({
                  type: 'error',
                  message: 'Please try again'
                })
              }
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async fetchCategory() {
      this.category = []
      const { data } = await this.$http.get('category')
      data.category.data.forEach((value) => {
        this.category.push(value)
      })
    }
  }
}
</script>

  <style lang="scss">
  </style>
