<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './Admin'
import editorDashboard from './Editor'
import guestDashboard from './Guest'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard, guestDashboard },
  data() {
    return {
      role_id: this.$store.getters.user.role_id
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ]),
    currentRole() {
      switch (parseInt(this.role_id)) {
        case 1:
          return adminDashboard
        case 2:
          return editorDashboard
        case 3:
          return guestDashboard
        default:
          return adminDashboard
      }
    }
  },
  async beforeCreate() {

  },

  mounted() {

  },
  created() {
    // if (!this.roles.includes('admin')) {
    //   this.currentRole = 'editorDashboard'
    // }
  }
}
</script>
