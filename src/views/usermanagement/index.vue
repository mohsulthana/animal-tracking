<template>
  <div class="dashboard-editor-container">

    <el-row>
      <div style="text-align:center"><h1>Users  Management</h1></div>
      <div>
        <usersmanage />
      </div>
    </el-row>

  </div>
</template>

<script>

import Usersmanage from '@/views/usermanagement/users'

export default {
  name: 'Users',
  components: {
    Usersmanage

  },

  data: () => {
    return {
    }
  },

  mounted() {
  },

  methods: {

  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}

</style>
